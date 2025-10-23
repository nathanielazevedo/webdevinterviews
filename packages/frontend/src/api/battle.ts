const API_BASE_URL = 'http://localhost:3001';

// Battle API functions
export const battleApi = {
  // Get current battle info
  getCurrentBattle: async () => {
    const response = await fetch(`${API_BASE_URL}/battle/current`);
    if (!response.ok) throw new Error('Failed to fetch current battle');
    return response.json();
  },

  // Get battle players
  getPlayers: async () => {
    const response = await fetch(`${API_BASE_URL}/battle/players`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  },

  // Get battle status
  getStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/battle/status`);
    if (!response.ok) throw new Error('Failed to fetch battle status');
    return response.json();
  }
};

// User API functions
export const userApi = {
  // Get user battles
  getUserBattles: async (userId: string, limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/battles?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch user battles');
    return response.json();
  },

  // Get user stats
  getUserStats: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch user stats');
    return response.json();
  }
};