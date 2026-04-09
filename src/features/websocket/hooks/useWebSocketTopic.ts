import { useEffect, useEffectEvent } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import type { WebSocketEvent } from '@/core/types/domain'
import { websocketService } from '@/features/websocket/services/websocketService'

export function useWebSocketTopic(
  destination: string | null,
  callback: (payload: unknown) => void,
) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const onMessage = useEffectEvent((payload: WebSocketEvent) => {
    callback(payload)
  })

  useEffect(() => {
    if (!destination) {
      return
    }

    const subscription = websocketService.subscribe(destination, (payload) => {
      onMessage(payload)
    })
    websocketService.connect(accessToken ?? undefined)

    return () => {
      subscription.unsubscribe()
    }
  }, [accessToken, destination])
}
