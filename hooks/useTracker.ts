import { useCallback } from 'react'
import apiClient from '@/services/apiClient'
import type {
  TrackEventInput,
  TrackingEventPayload,
  TrackingEventResponse,
  TrackingEventData,
} from '@/types/tracking.types'

/**
 * Custom hook for tracking user activities and events
 * @returns A function to track events with typed data
 */
const useTracker = () => {
  const trackEvent = useCallback(
    async <T extends TrackingEventData = TrackingEventData>(
      event: TrackEventInput<T>
    ): Promise<TrackingEventResponse | undefined> => {
      const trackingPayload: TrackingEventPayload = {
        type: event.type,
        timestamp: Date.now(),
        eventData: event.data as Record<string, any>,
        userId: event.userId,
        sessionId: event.sessionId,
      }

      try {
        const response = await apiClient.post<TrackingEventResponse>(
          '/progress-service/events',
          trackingPayload
        )
        return response.data
      } catch (error) {
        console.error('Error tracking event:', error)
        // Optionally: implement retry logic or offline queue here
        return undefined
      }
    },
    []
  )

  return trackEvent
}

export default useTracker