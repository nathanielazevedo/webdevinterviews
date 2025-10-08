

// API Configuration
export const API_CONFIG = {
  // WebSocket server URL for real-time communication
  WS_URL: import.meta.env.VITE_WS_URL || "wss://portfoliobackend-production-5f6f.up.railway.app",
  
  // HTTP API base URL (if needed for future REST endpoints)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://portfoliobackend-production-5f6f.up.railway.app",
  
  // Data API URL for static data endpoints
  DATA_API_URL: import.meta.env.VITE_DATA_API_URL || "https://data.webdevinterviews.com",
  
  // Development fallbacks
  DEV_WS_URL: "ws://localhost:3001",
  DEV_API_URL: "http://localhost:3001",
  DEV_DATA_URL: "http://localhost:3001", // Local data server if needed
} as const;

// Helper function to get the appropriate WebSocket URL
export const getWebSocketUrl = (): string => {
  // Use development URL if in development mode and environment variable not set
  if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_WS_URL) {
    return API_CONFIG.DEV_WS_URL;
  }
  
  return API_CONFIG.WS_URL;
};

// Helper function to get the appropriate API base URL
export const getApiBaseUrl = (): string => {
  // Use development URL if in development mode and environment variable not set
  if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_API_BASE_URL) {
    return API_CONFIG.DEV_API_URL;
  }
  
  return API_CONFIG.API_BASE_URL;
};

// Helper function to get the appropriate data API URL
export const getDataApiUrl = (): string => {
  // Use development URL if in development mode and environment variable not set
  if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_DATA_API_URL) {
    return API_CONFIG.DEV_DATA_URL;
  }
  
  return API_CONFIG.DATA_API_URL;
};

// API endpoint builders for the new battle endpoints
export const battleAPI = {
  // Get all players in a room
  getRoomPlayers: (roomId: string) => `${getApiBaseUrl()}/room/${roomId}/players`,
  
  // Get battle status for a room
  getRoomBattle: (roomId: string) => `${getApiBaseUrl()}/room/${roomId}/battle`,
  
  // Get user's battle history
  getUserBattles: (userId: string, limit = 50) => `${getApiBaseUrl()}/user/${userId}/battles?limit=${limit}`,
  
  // Get user's battle statistics
  getUserStats: (userId: string) => `${getApiBaseUrl()}/user/${userId}/stats`,
  
  // Get status of multiple rooms at once
  getRoomsStatus: (roomIds: string[]) => `${getApiBaseUrl()}/rooms/status?roomIds=${roomIds.join(',')}`,
};

// Helper functions for making API calls
export const apiHelpers = {
  // Fetch room players
  async fetchRoomPlayers(roomId: string) {
    const response = await fetch(battleAPI.getRoomPlayers(roomId));
    if (!response.ok) throw new Error(`Failed to fetch room players: ${response.statusText}`);
    return response.json();
  },

  // Fetch room battle status
  async fetchRoomBattle(roomId: string) {
    const response = await fetch(battleAPI.getRoomBattle(roomId));
    if (!response.ok) throw new Error(`Failed to fetch room battle: ${response.statusText}`);
    return response.json();
  },

  // Fetch user battle history
  async fetchUserBattles(userId: string, limit = 50) {
    const response = await fetch(battleAPI.getUserBattles(userId, limit));
    if (!response.ok) throw new Error(`Failed to fetch user battles: ${response.statusText}`);
    return response.json();
  },

  // Fetch user statistics
  async fetchUserStats(userId: string) {
    const response = await fetch(battleAPI.getUserStats(userId));
    if (!response.ok) throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    return response.json();
  },

  // Fetch multiple room statuses
  async fetchRoomsStatus(roomIds: string[]) {
    const response = await fetch(battleAPI.getRoomsStatus(roomIds));
    if (!response.ok) throw new Error(`Failed to fetch rooms status: ${response.statusText}`);
    return response.json();
  },
};