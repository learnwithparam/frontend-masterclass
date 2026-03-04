'use client';

/**
 * Live Order Feed — Admin Dashboard Component
 *
 * Shows a scrolling feed of real-time events from the WebSocket.
 * New events appear at the top with a subtle animation.
 */

import type { LiveEvent } from '@/hooks/use-live-orders';

interface LiveOrderFeedProps {
  events: LiveEvent[];
}

export function LiveOrderFeed({ events }: LiveOrderFeedProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Waiting for live events...</p>
        <p className="text-sm mt-1">Add or remove books via the API to see updates here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-3 p-3 bg-white border rounded-lg animate-[fadeIn_0.3s_ease-in]"
        >
          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
            event.type === 'book_added' ? 'bg-green-500' :
            event.type === 'book_removed' ? 'bg-red-500' :
            'bg-blue-500'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{event.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {event.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
