import type { ClientMessage, ServerMessage } from '@webdevinterviews/shared';
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
export declare class TypedWebSocketClient {
    private ws;
    private options;
    private reconnectAttempts;
    private reconnectTimeout;
    private eventListeners;
    constructor(options: WebSocketClientOptions);
    connect(): Promise<void>;
    disconnect(): void;
    send(message: ClientMessage): void;
    join(userId: string): void;
    getPlayers(): void;
    sendTestResults(passed: number, total: number): void;
    startBattle(): void;
    endBattle(userId: string): void;
    on<K extends keyof WebSocketClientEvents>(event: K, listener: WebSocketClientEvents[K]): void;
    off<K extends keyof WebSocketClientEvents>(event: K): void;
    private handleReconnect;
    get isConnected(): boolean;
    get readyState(): number | undefined;
}
export declare function createWebSocketClient(options: WebSocketClientOptions): TypedWebSocketClient;
