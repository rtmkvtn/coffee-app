import { FunctionComponent, SVGProps } from 'react'

import NotFoundIcon from './ui/404.svg?react'
import AddTicketIcon from './ui/add-ticket.svg?react'
import AddUserIcon from './ui/add-user.svg?react'
import ArchiveIcon from './ui/archive.svg?react'
import ArrowRightIcon from './ui/arrow-right.svg?react'
import ArrowUpIcon from './ui/arrow.svg?react'
import CheckIcon from './ui/check.svg?react'
import ClockIcon from './ui/clock.svg?react'
import CloseIcon from './ui/close.svg?react'
import CollectCoinsIcon from './ui/collect-coins.svg?react'
import CopyIcon from './ui/copy.svg?react'
import EyeIcon from './ui/eye.svg?react'
import FilmIcon from './ui/film.svg?react'
import GraphIcon from './ui/graph.svg?react'
import ImageRoundIcon from './ui/image-round.svg?react'
import ImageIcon from './ui/image.svg?react'
import InfoIcon from './ui/info.svg?react'
import LinkIcon from './ui/link.svg?react'
import LogoutIcon from './ui/logout.svg?react'
import MessageIcon from './ui/message.svg?react'
import MoonIcon from './ui/moon.svg?react'
import QrIcon from './ui/qr.svg?react'
import QuestionIcon from './ui/question.svg?react'
import SafeIcon from './ui/safe.svg?react'
import SearchIcon from './ui/search.svg?react'
import ShareIcon from './ui/share.svg?react'
import SidebarCollapseIcon from './ui/sidebar-collapse.svg?react'
import SlipIcon from './ui/slip.svg?react'
import StarHollowIcon from './ui/star-hollow.svg?react'
import StarIcon from './ui/star.svg?react'
import TicketIcon from './ui/ticket.svg?react'
import TicketsIcon from './ui/tickets.svg?react'
import TrashIcon from './ui/trash.svg?react'
import UserNoFrameIcon from './ui/user-no-frame.svg?react'
import UserIcon from './ui/user.svg?react'
import VoiceIcon from './ui/voice.svg?react'

import notFoundIcon from './ui/404.svg'
import addTicketIcon from './ui/add-ticket.svg'
import addUserIcon from './ui/add-user.svg'
import archiveIcon from './ui/archive.svg'
import arrowRightIcon from './ui/arrow-right.svg'
import arrowUpIcon from './ui/arrow.svg'
import checkIcon from './ui/check.svg'
import clockIcon from './ui/clock.svg'
import closeIcon from './ui/close.svg'
import collectCoinsIcon from './ui/collect-coins.svg'
import copyIcon from './ui/copy.svg'
import eyeIcon from './ui/eye.svg'
import filmIcon from './ui/film.svg'
import graphIcon from './ui/graph.svg'
import imageRoundIcon from './ui/image-round.svg'
import imageIcon from './ui/image.svg'
import infoIcon from './ui/info.svg'
import linkIcon from './ui/link.svg'
import logoutIcon from './ui/logout.svg'
import messageIcon from './ui/message.svg'
import moonIcon from './ui/moon.svg'
import qrIcon from './ui/qr.svg'
import questionIcon from './ui/question.svg'
import safeIcon from './ui/safe.svg'
import searchIcon from './ui/search.svg'
import shareIcon from './ui/share.svg'
import sidebarCollapseIcon from './ui/sidebar-collapse.svg'
import slipIcon from './ui/slip.svg'
import starHollowIcon from './ui/star-hollow.svg'
import starIcon from './ui/star.svg'
import ticketIcon from './ui/ticket.svg'
import ticketsIcon from './ui/tickets.svg'
import trashIcon from './ui/trash.svg'
import userNoFrameIcon from './ui/user-no-frame.svg'
import userIcon from './ui/user.svg'
import voiceIcon from './ui/voice.svg'

type SvgIconComponent = FunctionComponent<SVGProps<SVGSVGElement>>

export type IconTypes =
  | 'addTicket'
  | 'addUser'
  | 'archive'
  | 'arrowUp'
  | 'arrowRight'
  | 'check'
  | 'clock'
  | 'close'
  | 'collectCoins'
  | 'copy'
  | 'eye'
  | 'film'
  | 'graph'
  | 'image'
  | 'imageRound'
  | 'info'
  | 'link'
  | 'logout'
  | 'message'
  | 'moon'
  | 'notFound'
  | 'qr'
  | 'question'
  | 'safe'
  | 'search'
  | 'share'
  | 'sidebarCollapse'
  | 'slip'
  | 'star'
  | 'starHollow'
  | 'ticket'
  | 'tickets'
  | 'trash'
  | 'user'
  | 'userNoFrame'
  | 'voice'

type IProps = {
  tag?: 'svg' | 'img'
  alt?: string
  type: IconTypes
  className?: string
  color?: string
  size?: number
  width?: number
  height?: number
}

const Icon = ({
  tag = 'svg',
  alt = '',
  type,
  className,
  color,
  size = 24,
  width = size,
  height = size,
}: IProps) => {
  const isSvg = tag === 'svg'

  let result: { img: string; svg: SvgIconComponent | null } = {
    img: '',
    svg: null,
  }

  if (type === 'addTicket') result = { img: addTicketIcon, svg: AddTicketIcon }
  else if (type === 'addUser') result = { img: addUserIcon, svg: AddUserIcon }
  else if (type === 'archive') result = { img: archiveIcon, svg: ArchiveIcon }
  else if (type === 'arrowUp') result = { img: arrowUpIcon, svg: ArrowUpIcon }
  else if (type === 'arrowRight')
    result = { img: arrowRightIcon, svg: ArrowRightIcon }
  else if (type === 'check') result = { img: checkIcon, svg: CheckIcon }
  else if (type === 'clock') result = { img: clockIcon, svg: ClockIcon }
  else if (type === 'close') result = { img: closeIcon, svg: CloseIcon }
  else if (type === 'collectCoins')
    result = { img: collectCoinsIcon, svg: CollectCoinsIcon }
  else if (type === 'copy') result = { img: copyIcon, svg: CopyIcon }
  else if (type === 'eye') result = { img: eyeIcon, svg: EyeIcon }
  else if (type === 'film') result = { img: filmIcon, svg: FilmIcon }
  else if (type === 'graph') result = { img: graphIcon, svg: GraphIcon }
  else if (type === 'image') result = { img: imageIcon, svg: ImageIcon }
  else if (type === 'imageRound')
    result = { img: imageRoundIcon, svg: ImageRoundIcon }
  else if (type === 'info') result = { img: infoIcon, svg: InfoIcon }
  else if (type === 'link') result = { img: linkIcon, svg: LinkIcon }
  else if (type === 'logout') result = { img: logoutIcon, svg: LogoutIcon }
  else if (type === 'message') result = { img: messageIcon, svg: MessageIcon }
  else if (type === 'moon') result = { img: moonIcon, svg: MoonIcon }
  else if (type === 'notFound')
    result = { img: notFoundIcon, svg: NotFoundIcon }
  else if (type === 'qr') result = { img: qrIcon, svg: QrIcon }
  else if (type === 'question')
    result = { img: questionIcon, svg: QuestionIcon }
  else if (type === 'safe') result = { img: safeIcon, svg: SafeIcon }
  else if (type === 'search') result = { img: searchIcon, svg: SearchIcon }
  else if (type === 'share') result = { img: shareIcon, svg: ShareIcon }
  else if (type === 'sidebarCollapse')
    result = { img: sidebarCollapseIcon, svg: SidebarCollapseIcon }
  else if (type === 'slip') result = { img: slipIcon, svg: SlipIcon }
  else if (type === 'star') result = { img: starIcon, svg: StarIcon }
  else if (type === 'starHollow')
    result = { img: starHollowIcon, svg: StarHollowIcon }
  else if (type === 'ticket') result = { img: ticketIcon, svg: TicketIcon }
  else if (type === 'tickets') result = { img: ticketsIcon, svg: TicketsIcon }
  else if (type === 'trash') result = { img: trashIcon, svg: TrashIcon }
  else if (type === 'user') result = { img: userIcon, svg: UserIcon }
  else if (type === 'userNoFrame')
    result = { img: userNoFrameIcon, svg: UserNoFrameIcon }
  else if (type === 'voice') result = { img: voiceIcon, svg: VoiceIcon }

  if (isSvg && result.svg) {
    return (
      <result.svg
        width={width}
        height={height}
        className={className}
        color={color}
      />
    )
  }

  if (result.img) {
    return (
      <img
        src={result.img}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  return null
}

export default Icon
