import { useEffect } from 'react'

import { useAuthStore } from '@/app/store/auth.store'
import { websocketService } from '@/features/websocket/services/websocketService'

export function useWebSocketTopic(
  destination: string | null,
  callback: (payload: unknown) => void,
) {
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (!destination) {
      return
    }

    const client = websocketService.connect(accessToken ?? undefined)
    const subscription = websocketService.subscribe(destination, callback)

    return () => {
      subscription?.unsubscribe()
      if (!client.connected) {
        websocketService.disconnect()
      }
    }
  }, [accessToken, callback, destination])
}
