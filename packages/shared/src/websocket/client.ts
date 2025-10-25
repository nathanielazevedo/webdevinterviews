// Typed WebSocket client for Portfolio Battle API

import type {
  WebSocketMessage,
  ClientMessage,
  ServerMessage,
  JoinMessage,
  GetPlayersMessage,
  TestResultsMessage,
  StartBattleMessage,
  EndBattleMessage,
} from '@webdevinterviews/shared';

export interface WebSocketClientOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface WebSocketClientEvents {
  open: () => void;
  close: (code: number, reason: string) => void;
  error: (error: Event) => void;
  message: (message: ServerMessage) => void;
}

export class TypedWebSocketClient {
  private ws: WebSocket | null = null;
  private options: Required<WebSocketClientOptions>;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Partial<WebSocketClientEvents> = {};

  constructor(options: WebSocketClientOptions) {
    this.options = {
      reconnectAttempts: 5,
      reconnectInterval: 1000,
      ...options,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.options.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.eventListeners.open?.();
          resolve();
        };

        this.ws.onclose = (event) => {
          this.eventListeners.close?.(event.code, event.reason);
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          this.eventListeners.error?.(error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: ServerMessage = JSON.parse(event.data);
            this.eventListeners.message?.(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: ClientMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  // Convenience methods for specific message types
  join(userId: string): void {
    const message: JoinMessage = { type: 'join', userId };
    this.send(message);
  }

  getPlayers(): void {
    const message: GetPlayersMessage = { type: 'get-players' };
    this.send(message);
  }

  sendTestResults(testsPassed: number): void {
    const message: TestResultsMessage = { type: 'test-results', testsPassed };
    this.send(message);
  }

  startBattle(): void {
    const message: StartBattleMessage = { type: 'start-battle' };
    this.send(message);
  }

  endBattle(userId: string): void {
    const message: EndBattleMessage = { type: 'end-battle', userId };
    this.send(message);
  }

  // Event listener methods
  on<K extends keyof WebSocketClientEvents>(
    event: K,
    listener: WebSocketClientEvents[K]
  ): void {
    this.eventListeners[event] = listener;
  }

  off<K extends keyof WebSocketClientEvents>(event: K): void {
    delete this.eventListeners[event];
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.options.reconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.reconnectAttempts})...`);

      this.reconnectTimeout = setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.options.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get readyState(): number | undefined {
    return this.ws?.readyState;
  }
}

// Factory function for easy instantiation
export function createWebSocketClient(options: WebSocketClientOptions): TypedWebSocketClient {
  return new TypedWebSocketClient(options);
}