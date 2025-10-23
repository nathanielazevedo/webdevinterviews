import React, { createContext, useState, useEffect, ReactNode } from "react";

// Simple WebSocket client for our battle system
class SimpleWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = "";
  private listeners: Map<string, Set<Function>> = new Map();

  connect(url: string) {
    this.url = url;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.emit("connected");
    };

    this.ws.onclose = () => {
      this.emit("disconnected");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit("message", data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      this.emit("error", error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
    } else if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: string, data?: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket ${event} listener:`, error);
        }
      });
    }
  }
}

// API Configuration Interface
interface ApiConfig {
  baseUrl: string;
  wsUrl: string;
  timeout: number;
  retryAttempts: number;
  environment: "development" | "production" | "staging";
}

// API State Interface
interface ApiState {
  isOnline: boolean;
  wsConnected: boolean;
  lastSync: Date | null;
  errors: string[];
  loading: Record<string, boolean>;
}

// API Context Interface
interface ApiContextType {
  // Configuration
  config: ApiConfig;
  updateConfig: (newConfig: Partial<ApiConfig>) => void;

  // State
  state: ApiState;

  // WebSocket client
  wsClient: SimpleWebSocketClient;

  // WebSocket Operations
  connectWs: () => void;
  disconnectWs: () => void;

  // Utility Functions
  setLoading: (key: string, loading: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  isLoading: (key: string) => boolean;
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:3001"
      : "https://portfoliobackend-production-5f6f.up.railway.app"),
  wsUrl:
    import.meta.env.VITE_WS_URL ||
    (import.meta.env.MODE === "development"
      ? "ws://localhost:3001"
      : "wss://portfoliobackend-production-5f6f.up.railway.app"),
  timeout: 30000,
  retryAttempts: 3,
  environment:
    (import.meta.env.MODE as "development" | "production" | "staging") ||
    "development",
};

// Default state
const defaultState: ApiState = {
  isOnline: navigator.onLine,
  wsConnected: false,
  lastSync: null,
  errors: [],
  loading: {},
};

// Create Context
export const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider Props
interface ApiProviderProps {
  children: ReactNode;
  initialConfig?: Partial<ApiConfig>;
}

// API Provider Component
export const ApiProvider: React.FC<ApiProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<ApiConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const [state, setState] = useState<ApiState>(defaultState);

  // Initialize WebSocket client
  const [wsClientInstance] = useState(() => new SimpleWebSocketClient());

  // Update configuration
  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // State management utilities
  const setLoading = (key: string, loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, [key]: loading },
    }));
  };

  const addError = (error: string) => {
    setState((prev) => ({
      ...prev,
      errors: [...prev.errors, error],
    }));
  };

  const clearErrors = () => {
    setState((prev) => ({ ...prev, errors: [] }));
  };

  const isLoading = (key: string): boolean => {
    return state.loading[key] || false;
  };

  // WebSocket Operations
  const connectWs = () => {
    wsClientInstance.connect(config.wsUrl);
  };

  const disconnectWs = () => {
    wsClientInstance.disconnect();
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Monitor WebSocket connection
  useEffect(() => {
    const handleWsConnected = () => {
      setState((prev) => ({ ...prev, wsConnected: true }));
    };

    const handleWsDisconnected = () => {
      setState((prev) => ({ ...prev, wsConnected: false }));
    };

    wsClientInstance.on("connected", handleWsConnected);
    wsClientInstance.on("disconnected", handleWsDisconnected);

    return () => {
      wsClientInstance.off("connected", handleWsConnected);
      wsClientInstance.off("disconnected", handleWsDisconnected);
    };
  }, [wsClientInstance]);

  // Auto-clear errors after 10 seconds
  useEffect(() => {
    if (state.errors.length > 0) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [state.errors.length]);

  const contextValue: ApiContextType = {
    config,
    updateConfig,
    state,
    wsClient: wsClientInstance,
    connectWs,
    disconnectWs,
    setLoading,
    addError,
    clearErrors,
    isLoading,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};

// Export types for use in other components
export type { ApiConfig, ApiState, ApiContextType };
