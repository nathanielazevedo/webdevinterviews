import { useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';
import type { ApiContextType } from '../contexts/ApiContext';

// Custom hook to use API context
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Additional hooks for specific use cases
export const useApiState = () => {
  const { state } = useApi();
  return state;
};

export const useApiConfig = () => {
  const { config, updateConfig } = useApi();
  return { config, updateConfig };
};

export const useApiLoading = (key: string) => {
  const { isLoading } = useApi();
  return isLoading(key);
};

export const useWebSocket = () => {
  const { wsClient, connectWs, disconnectWs, joinRoom, sendTestResults, state } = useApi();
  return { 
    wsClient, 
    connectWs, 
    disconnectWs, 
    joinRoom, 
    sendTestResults, 
    connected: state.wsConnected 
  };
};