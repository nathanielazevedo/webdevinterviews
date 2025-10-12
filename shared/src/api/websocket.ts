/**
 * Type-safe WebSocket client for real-time communication
 */

export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners = new Map<string, Set<(data: unknown) => void>>();
  // Temporarily disabled reconnection variables
  // private reconnectAttempts = 0;
  // private maxReconnectAttempts = 5;
  // private reconnectDelay = 1000;

  constructor(url: string = "ws://localhost:3001") {
    this.url = url;
  }

  connect(url?: string): void {
    if (url) this.url = url;
    
    // Prevent duplicate connections
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        // this.reconnectAttempts = 0;
        this.emit("connected", null);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.emit(message.type || "message", message.data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.emit("disconnected", null);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send<T>(type: string, data: T): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = { type, data };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  on<T>(event: string, callback: (data: T) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as (data: unknown) => void);
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (!this.listeners.has(event)) return;

    if (callback) {
      this.listeners.get(event)!.delete(callback);
    } else {
      this.listeners.get(event)!.clear();
    }
  }

  private emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  private attemptReconnect(): void {
    // Temporarily disable auto-reconnection to prevent infinite loops
    // TODO: Implement smarter reconnection logic
    console.log("WebSocket disconnected. Auto-reconnection disabled.");
    
    // Uncomment below to re-enable reconnection
    /*
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
    */
  }
}

// Default WebSocket client instance
export const wsClient = new WebSocketClient(
  import.meta.env?.VITE_WS_URL || "ws://localhost:3001"
);