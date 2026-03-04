/**
 * Typed WebSocket Messages
 *
 * KEY CONCEPT: Define message types so both sides of the WebSocket
 * agree on the shape of data. Without this, you're parsing unknown
 * JSON and hoping for the best.
 */

export interface WsWelcomeMessage {
  type: 'welcome';
  message: string;
  user: { userId: number; username: string; role: string };
}

export interface WsSubscribedMessage {
  type: 'subscribed';
  channel: string;
  message: string;
}

export interface WsInventoryChangedMessage {
  type: 'inventory_changed';
  bookId: number;
  stock: number;
  updatedBy: string;
  timestamp: string;
}

export interface WsBookAddedMessage {
  type: 'book_added';
  data: {
    id: number;
    title: string;
    author: string;
    pages: number;
    published: string;
  };
}

export interface WsBookRemovedMessage {
  type: 'book_removed';
  data: { id: number };
}

export interface WsErrorMessage {
  type: 'error';
  message: string;
}

export type WsMessage =
  | WsWelcomeMessage
  | WsSubscribedMessage
  | WsInventoryChangedMessage
  | WsBookAddedMessage
  | WsBookRemovedMessage
  | WsErrorMessage;
