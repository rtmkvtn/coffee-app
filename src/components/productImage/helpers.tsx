import FireIcon from '@assets/images/common/fire.svg?react'
import FireIceIcon from '@assets/images/common/fireice.svg?react'
import IceIcon from '@assets/images/common/ice.svg?react'

import { IProductTemperature } from '@models/product.model'

export const getTemperaturesImage = (temps: IProductTemperature[]) => {
  if (temps.length === 0) {
    return null
  }

  if (temps.length === 2) {
    return <FireIceIcon />
  }

  if (temps[0] === 'cold') {
    return <IceIcon />
  } else {
    return <FireIcon />
  }
}
