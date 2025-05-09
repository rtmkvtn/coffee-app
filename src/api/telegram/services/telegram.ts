import { errors } from '@strapi/utils'
import crypto from 'node:crypto'

interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

const validateInitData = (initData: string): boolean => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) throw new Error('Missing Telegram bot token')

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return false

  params.delete('hash')
  params.sort()

  const secret = crypto.createHash('sha256').update(botToken).digest()

  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(params.toString())
    .digest('hex')

  return hash === calculatedHash
}

const parseInitData = (
  initData: string | Record<string, any>
): TelegramUser => {
  console.log('Received initData:', initData)
  const params =
    typeof initData === 'string' ? new URLSearchParams(initData) : initData
  console.log('Parsed params:', Object.fromEntries(params.entries()))
  const userJson = params.get('user')
  console.log('User JSON:', userJson)
  if (!userJson) throw new Error('Missing user data')

  return JSON.parse(userJson) as TelegramUser
}

export default ({ strapi }) => ({
  async createOrUpdateUser(initData: string) {
    console.log('Raw initData received:', initData)
    if (process.env.NODE_ENV !== 'development' && !validateInitData(initData)) {
      throw new errors.UnauthorizedError('Invalid Telegram hash')
    }

    const userData = parseInitData(initData)
    const usersService = strapi.service('plugin::users-permissions.user')
    const jwtService = strapi.plugin('users-permissions').service('jwt')
    console.log('userData', userData)
    // Strapi v5 uses EntityService API
    const [existingUser] = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        filters: { telegramId: userData.id },
        limit: 1,
      }
    )

    const updateData = {
      lastVisit: new Date().toISOString(),
      ...(userData.photo_url && { avatar: userData.photo_url }),
    }
    console.log('EXISTS', existingUser)

    if (existingUser) {
      const user = await strapi.entityService.update(
        'plugin::users-permissions.user',
        existingUser.id,
        { data: updateData }
      )

      let [cart] = await strapi.documents('api::cart.cart').findMany({
        filters: {
          user: { id: { $eq: existingUser.id } },
        },
        limit: 1,
      })
      console.log('CART', cart)
      if (!cart) {
        cart = await strapi.documents('api::cart.cart').create({
          data: {
            user: existingUser.id,
            items: [],
          },
        })
      }

      return {
        jwt: jwtService.issue(user),
        user: sanitizeUser(user),
        cart,
      }
    }

    const newUser = await usersService.add({
      ...updateData,
      username: userData.username || `tg_${userData.id}`,
      email: `${userData.id}@telegram.tmp`,
      telegramId: userData.id,
      provider: 'telegram',
      confirmed: true,
      role: 1, // Authenticated role ID
    })

    const newCart = await strapi.documents('api::cart.cart').create({
      data: {
        user: newUser.id,
        items: [],
      },
    })

    return {
      jwt: jwtService.issue(newUser),
      user: sanitizeUser(newUser),
      cart: newCart,
    }
  },
})

const sanitizeUser = (rawUser: any) => {
  return {
    id: rawUser.id,
    username: rawUser.username,
    email: rawUser.email,
    blocked: rawUser.blocked,
    telegramId: rawUser.telegramId,
  }
}
