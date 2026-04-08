import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { env } from '@/core/config/env'
import type { WebSocketEvent } from '@/core/types/domain'

class WebsocketService {
  private client: Client | null = null

  connect(token?: string) {
    if (this.client?.active) {
      return this.client
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(env.wsUrl),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    })

    this.client.activate()
    return this.client
  }

  disconnect() {
    this.client?.deactivate()
    this.client = null
  }

  subscribe(destination: string, callback: (event: WebSocketEvent) => void) {
    if (!this.client) {
      return null
    }

    return this.client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body) as WebSocketEvent)
    })
  }
}

export const websocketService = new WebsocketService()
