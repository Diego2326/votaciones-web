import { useState } from 'react'

import type { WebSocketEvent } from '@/core/types/domain'
import { useWebSocketTopic } from '@/features/websocket/hooks/useWebSocketTopic'

export function useRoundLiveUpdates(tournamentId?: string, roundId?: string) {
  const [latestEvent, setLatestEvent] = useState<WebSocketEvent | null>(null)

  useWebSocketTopic(
    tournamentId && roundId ? `/topic/tournament/${tournamentId}/round/${roundId}` : null,
    (event) => setLatestEvent(event as WebSocketEvent),
  )

  return latestEvent
}
