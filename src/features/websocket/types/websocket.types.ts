import type { StompSubscription } from '@stomp/stompjs'

import type { WebSocketEvent } from '@/core/types/domain'

export interface TopicSubscription {
  destination: string
  callback: (event: WebSocketEvent) => void
}

export type ActiveSubscription = StompSubscription
