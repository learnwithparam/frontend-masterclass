'use client';

/**
 * useLiveOrders Hook — Live Order/Book Feed for Admin Dashboard
 *
 * KEY CONCEPT: Same SSR + WebSocket hybrid as useLiveStock, but for
 * an event feed instead of a value map. Each incoming WebSocket message
 * gets transformed into a human-readable event and prepended to a
 * capped list (last 50). This pattern works for any "activity log" UI.
 *
 * Tracks book_added, book_removed, and inventory_changed events from
 * the catalog channel. Maintains a list of recent events for display
 * in a live feed.
 */
import { useState, useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import type { WsMessage } from '@/lib/websocket/messages';

export interface LiveEvent {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface UseLiveOrdersReturn {
  events: LiveEvent[];
  status: string;
}

export function useLiveOrders(token: string | null): UseLiveOrdersReturn {
  const [events, setEvents] = useState<LiveEvent[]>([]);

  const { status, lastMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
    token,
    channels: ['catalog'],
  });

  useEffect(() => {
    if (!lastMessage) return;

    let message = '';
    if (lastMessage.type === 'book_added') {
      message = `New book added: "${lastMessage.data.title}" by ${lastMessage.data.author}`;
    } else if (lastMessage.type === 'book_removed') {
      message = `Book #${lastMessage.data.id} removed from catalog`;
    } else if (lastMessage.type === 'inventory_changed') {
      message = `Book #${lastMessage.bookId} stock updated to ${lastMessage.stock} by ${lastMessage.updatedBy}`;
    } else {
      return; // Skip other message types
    }

    const event: LiveEvent = {
      id: `${Date.now()}-${Math.random()}`,
      type: lastMessage.type,
      message,
      timestamp: new Date(),
    };

    setEvents((prev) => [event, ...prev].slice(0, 50)); // Keep last 50
  }, [lastMessage]);

  return { events, status };
}
