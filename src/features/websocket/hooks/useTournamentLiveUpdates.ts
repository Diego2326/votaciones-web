import { useState } from 'react'

import type { WebSocketEvent } from '@/core/types/domain'
import { useWebSocketTopic } from '@/features/websocket/hooks/useWebSocketTopic'

export function useTournamentLiveUpdates(tournamentId?: string) {
  const [latestEvent, setLatestEvent] = useState<WebSocketEvent | null>(null)

  useWebSocketTopic(
    tournamentId ? `/topic/tournament/${tournamentId}` : null,
    (event) => setLatestEvent(event as WebSocketEvent),
  )

  return latestEvent
}
