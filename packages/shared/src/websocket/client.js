// Typed WebSocket client for Portfolio Battle API
export class TypedWebSocketClient {
    ws = null;
    options;
    reconnectAttempts = 0;
    reconnectTimeout = null;
    eventListeners = {};
    constructor(options) {
        this.options = {
            reconnectAttempts: 5,
            reconnectInterval: 1000,
            ...options,
        };
    }
    connect() {
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
                        const message = JSON.parse(event.data);
                        this.eventListeners.message?.(message);
                    }
                    catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
        else {
            throw new Error('WebSocket is not connected');
        }
    }
    // Convenience methods for specific message types
    join(userId) {
        const message = { type: 'join', userId };
        this.send(message);
    }
    getPlayers() {
        const message = { type: 'get-players' };
        this.send(message);
    }
    sendTestResults(passed, total) {
        const message = { type: 'test-results', passed, total };
        this.send(message);
    }
    startBattle() {
        const message = { type: 'start-battle' };
        this.send(message);
    }
    endBattle(userId) {
        const message = { type: 'end-battle', userId };
        this.send(message);
    }
    // Event listener methods
    on(event, listener) {
        this.eventListeners[event] = listener;
    }
    off(event) {
        delete this.eventListeners[event];
    }
    handleReconnect() {
        if (this.reconnectAttempts < this.options.reconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.reconnectAttempts})...`);
            this.reconnectTimeout = setTimeout(() => {
                this.connect().catch((error) => {
                    console.error('Reconnection failed:', error);
                });
            }, this.options.reconnectInterval);
        }
        else {
            console.error('Max reconnection attempts reached');
        }
    }
    get isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
    get readyState() {
        return this.ws?.readyState;
    }
}
// Factory function for easy instantiation
export function createWebSocketClient(options) {
    return new TypedWebSocketClient(options);
}
