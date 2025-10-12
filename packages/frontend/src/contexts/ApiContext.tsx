import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  apiClient,
  wsClient,
  WebSocketClient,
} from "@webdevinterviews/shared";
import type {
  BattleStatusResponse,
  PlayersResponse,
  UserStatsResponse,
} from "@webdevinterviews/shared";

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

  // API Clients
  httpClient: typeof apiClient;
  wsClient: WebSocketClient;

  // Common API Operations
  getRoomBattle: (roomId: string) => Promise<BattleStatusResponse>;
  getRoomPlayers: (roomId: string) => Promise<PlayersResponse>;
  getUserStats: (userId: string) => Promise<UserStatsResponse>;

  // WebSocket Operations
  connectWs: () => void;
  disconnectWs: () => void;
  joinRoom: (roomId: string, userId: string) => void;
  sendTestResults: (passed: number, total: number) => void;

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

  // Initialize API clients with current config
  const [httpClient] = useState(() => apiClient);
  const [wsClientInstance] = useState(() => wsClient);

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

  // Common API Operations with error handling and loading states
  const getRoomBattle = async (
    roomId: string
  ): Promise<BattleStatusResponse> => {
    const loadingKey = `room-battle-${roomId}`;
    setLoading(loadingKey, true);

    try {
      const { data, error } = await httpClient.GET("/room/{roomId}/battle", {
        params: { path: { roomId } }
      });
      if (error) throw new Error("API Error");
      setState((prev) => ({ ...prev, lastSync: new Date() }));
      return data;
    } catch (error) {
      const errorMsg = `Failed to fetch battle for room ${roomId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      addError(errorMsg);
      throw error;
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const getRoomPlayers = async (roomId: string): Promise<PlayersResponse> => {
    const loadingKey = `room-players-${roomId}`;
    setLoading(loadingKey, true);

    try {
      const { data, error } = await httpClient.GET("/room/{roomId}/players", {
        params: { path: { roomId } }
      });
      if (error) throw new Error("API Error");
      setState((prev) => ({ ...prev, lastSync: new Date() }));
      return data;
    } catch (error) {
      const errorMsg = `Failed to fetch players for room ${roomId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      addError(errorMsg);
      throw error;
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const getUserStats = async (userId: string): Promise<UserStatsResponse> => {
    const loadingKey = `user-stats-${userId}`;
    setLoading(loadingKey, true);

    try {
      const { data, error } = await httpClient.GET("/user/{userId}/stats", {
        params: { path: { userId } }
      });
      if (error) throw new Error("API Error");
      setState((prev) => ({ ...prev, lastSync: new Date() }));
      return data;
    } catch (error) {
      const errorMsg = `Failed to fetch stats for user ${userId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      addError(errorMsg);
      throw error;
    } finally {
      setLoading(loadingKey, false);
    }
  };

  // WebSocket Operations
  const connectWs = () => {
    wsClientInstance.connect(config.wsUrl);
  };

  const disconnectWs = () => {
    wsClientInstance.disconnect();
  };

  const joinRoom = (roomId: string, userId: string) => {
    wsClientInstance.send("join-room", {
      roomId,
      userId,
    });
  };

  const sendTestResults = (passed: number, total: number) => {
    wsClientInstance.send("test-results", {
      passed,
      total,
    });
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
    httpClient,
    wsClient: wsClientInstance,
    getRoomBattle,
    getRoomPlayers,
    getUserStats,
    connectWs,
    disconnectWs,
    joinRoom,
    sendTestResults,
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
