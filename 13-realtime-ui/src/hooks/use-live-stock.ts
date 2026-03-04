'use client';

/**
 * useLiveStock Hook — Track Real-Time Inventory Changes
 *
 * KEY CONCEPT: SSR + WebSocket hybrid pattern. The page loads with
 * server-rendered data (fast first paint, SEO-friendly). After hydration,
 * this hook opens a WebSocket and applies live stock updates on top of
 * the SSR data. The user sees instant content that stays current —
 * best of both worlds.
 *
 * Listens for inventory_changed messages and maintains a map
 * of bookId → stock count. Components can read the latest stock
 * for any book without polling.
 */
import { useState, useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import type { WsMessage } from '@/lib/websocket/messages';

interface StockMap {
  [bookId: number]: number;
}

interface UseLiveStockReturn {
  stock: StockMap;
  status: string;
}

export function useLiveStock(token: string | null): UseLiveStockReturn {
  const [stock, setStock] = useState<StockMap>({});

  const { status, lastMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
    token,
    channels: ['catalog'],
  });

  useEffect(() => {
    if (lastMessage?.type === 'inventory_changed') {
      setStock((prev) => ({
        ...prev,
        [lastMessage.bookId]: lastMessage.stock,
      }));
    }
  }, [lastMessage]);

  return { stock, status };
}
