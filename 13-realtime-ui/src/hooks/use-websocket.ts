'use client';

/**
 * useWebSocket Hook — Connect React to WebSocket
 *
 * KEY CONCEPT: This hook manages the WebSocket lifecycle within React.
 * It connects on mount, disconnects on unmount, and provides reactive
 * state (status, messages) that triggers re-renders.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketClient } from '@/lib/websocket/client';
import type { WsMessage } from '@/lib/websocket/messages';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface UseWebSocketOptions {
  url: string;
  token: string | null;
  channels?: string[];
}

interface UseWebSocketReturn {
  status: ConnectionStatus;
  lastMessage: WsMessage | null;
  send: (message: object) => void;
}

export function useWebSocket({ url, token, channels = [] }: UseWebSocketOptions): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    if (!token) return;

    const client = new WebSocketClient(url, token);
    clientRef.current = client;

    const unsubStatus = client.onStatusChange((newStatus) => {
      setStatus(newStatus);

      // Subscribe to channels when connected
      if (newStatus === 'connected') {
        channels.forEach((channel) => client.subscribe(channel));
      }
    });

    const unsubMessage = client.onMessage((data: WsMessage) => {
      setLastMessage(data);
    });

    client.connect();

    return () => {
      unsubStatus();
      unsubMessage();
      client.disconnect();
      clientRef.current = null;
    };
  }, [url, token, channels.join(',')]);

  const send = useCallback((message: object) => {
    clientRef.current?.send(message);
  }, []);

  return { status, lastMessage, send };
}
