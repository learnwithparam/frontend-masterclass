/**
 * WebSocket Client with Auto-Reconnect
 *
 * KEY CONCEPT: WebSocket connections drop — network changes, server
 * deploys, WiFi hiccups. A production client MUST auto-reconnect
 * with exponential backoff: 1s, 2s, 4s, 8s, ... up to 30s max.
 *
 * Without backoff, 10,000 clients reconnecting simultaneously after
 * a server restart creates a "thundering herd" that crashes it again.
 */

type MessageHandler = (data: any) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected') => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private messageHandlers: MessageHandler[] = [];
  private statusHandlers: StatusHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionallyClosed = false;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  connect(): void {
    this.intentionallyClosed = false;
    this.notifyStatus('connecting');

    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.notifyStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(data));
      } catch {
        // Ignore non-JSON messages
      }
    };

    this.ws.onclose = () => {
      this.notifyStatus('disconnected');
      if (!this.intentionallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      // onclose will fire after onerror, triggering reconnect
    };
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribe(channel: string): void {
    this.send({ type: 'subscribe', channel });
  }

  unsubscribe(channel: string): void {
    this.send({ type: 'unsubscribe', channel });
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }

  private scheduleReconnect(): void {
    // Exponential backoff: 1s, 2s, 4s, 8s, ... up to maxReconnectDelay
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected'): void {
    this.statusHandlers.forEach((handler) => handler(status));
  }
}
