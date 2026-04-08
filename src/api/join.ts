import { apiRequest, sessionRequest } from './http'
import type { JoinInfo, JoinSession } from '../types/domain'

interface PinPayload {
  pin: string
}

interface QrPayload {
  qrToken: string
}

interface DisplayNameJoinPayload {
  pin?: string
  qrToken?: string
  displayName: string
}

interface EmailPasswordJoinPayload {
  pin?: string
  qrToken?: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export const joinApi = {
  resolveByPin(payload: PinPayload) {
    return apiRequest<JoinInfo>('/api/v1/join/pin', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  resolveByQr(payload: QrPayload) {
    return apiRequest<JoinInfo>('/api/v1/join/qr/info', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  joinAnonymously(payload: QrPayload) {
    return apiRequest<JoinSession>('/api/v1/join/qr', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  joinWithDisplayName(payload: DisplayNameJoinPayload) {
    return apiRequest<JoinSession>('/api/v1/join/name', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  joinWithEmailPassword(payload: EmailPasswordJoinPayload) {
    return apiRequest<JoinSession>('/api/v1/join/auth', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getCurrentSession(sessionToken: string) {
    return sessionRequest<JoinSession>('/api/v1/join/me', {
      method: 'GET',
      sessionToken,
    })
  },
}
