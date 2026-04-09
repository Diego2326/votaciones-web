import { Client, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { env } from '@/core/config/env'
import type { WebSocketEvent } from '@/core/types/domain'

interface ListenerEntry {
  id: number
  destination: string
  callback: (event: WebSocketEvent) => void
  subscription: StompSubscription | null
}

class WebsocketService {
  private client: Client | null = null
  private token: string | null = null
  private listeners = new Map<number, ListenerEntry>()
  private nextListenerId = 1

  connect(token?: string) {
    const nextToken = token ?? null

    if (this.client?.active && this.token === nextToken) {
      return
    }

    if (this.client && this.token !== nextToken) {
      this.disconnect()
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(env.wsUrl),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    })

    client.onConnect = () => {
      if (this.client !== client) {
        return
      }

      for (const listener of this.listeners.values()) {
        this.attachSubscription(listener)
      }
    }

    client.onWebSocketClose = () => {
      if (this.client !== client) {
        return
      }

      for (const listener of this.listeners.values()) {
        listener.subscription = null
      }
    }

    this.client = client
    this.token = nextToken
    client.activate()
  }

  disconnect() {
    const client = this.client

    this.client = null
    this.token = null

    for (const listener of this.listeners.values()) {
      listener.subscription = null
    }

    void client?.deactivate()
  }

  private attachSubscription(listener: ListenerEntry) {
    if (!this.client?.connected) {
      return
    }

    listener.subscription?.unsubscribe()
    listener.subscription = this.client.subscribe(listener.destination, (message) => {
      listener.callback(JSON.parse(message.body) as WebSocketEvent)
    })
  }

  subscribe(destination: string, callback: (event: WebSocketEvent) => void) {
    const listener: ListenerEntry = {
      id: this.nextListenerId++,
      destination,
      callback,
      subscription: null,
    }

    this.listeners.set(listener.id, listener)

    if (this.client?.connected) {
      this.attachSubscription(listener)
    }

    return {
      unsubscribe: () => {
        const activeListener = this.listeners.get(listener.id)

        if (!activeListener) {
          return
        }

        activeListener.subscription?.unsubscribe()
        this.listeners.delete(listener.id)

        if (this.listeners.size === 0) {
          this.disconnect()
        }
      },
    }
  }
}

export const websocketService = new WebsocketService()
