import { generatePath } from 'react-router-dom'

import { ROUTES } from '@/core/constants/routes'

export function buildTournamentQrJoinUrl(qrToken: string) {
  const joinPath = generatePath(ROUTES.joinQr, { qrToken })

  if (typeof window === 'undefined') {
    return joinPath
  }

  return new URL(joinPath, window.location.origin).toString()
}

export function buildQrImageUrl(data: string, size = '220x220') {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`
}
