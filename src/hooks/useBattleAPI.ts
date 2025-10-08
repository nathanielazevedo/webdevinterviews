import { useState, useEffect, useCallback } from 'react';
import { apiHelpers } from '../config/api';
import {
  BattleResponse,
  PlayersResponse,
  UserBattlesResponse,
  UserStatsResponse,
  RoomsStatusResponse,
} from '../types/battle';

// Hook for fetching room battle status
export const useRoomBattle = (roomId: string) => {
  const [battle, setBattle] = useState<BattleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBattle = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiHelpers.fetchRoomBattle(roomId);
      setBattle(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch battle');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle]);

  return { battle, loading, error, refetch: fetchBattle };
};

// Hook for fetching room players
export const useRoomPlayers = (roomId: string) => {
  const [players, setPlayers] = useState<PlayersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiHelpers.fetchRoomPlayers(roomId);
      setPlayers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, refetch: fetchPlayers };
};

// Hook for fetching user battle history
export const useUserBattles = (userId: string, limit = 50) => {
  const [battles, setBattles] = useState<UserBattlesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBattles = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiHelpers.fetchUserBattles(userId, limit);
      setBattles(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch battles');
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  return { battles, loading, error, refetch: fetchBattles };
};

// Hook for fetching user statistics
export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiHelpers.fetchUserStats(userId);
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for watching multiple room statuses
export const useRoomsStatus = (roomIds: string[]) => {
  const [roomsStatus, setRoomsStatus] = useState<RoomsStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomsStatus = useCallback(async () => {
    if (!roomIds.length) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiHelpers.fetchRoomsStatus(roomIds);
      setRoomsStatus(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms status');
    } finally {
      setLoading(false);
    }
  }, [roomIds]);

  useEffect(() => {
    fetchRoomsStatus();
  }, [fetchRoomsStatus]);

  return { roomsStatus, loading, error, refetch: fetchRoomsStatus };
};

// Hook for periodic polling of room status
export const useRoomStatusPolling = (roomId: string, intervalMs = 5000) => {
  const { battle, loading, error, refetch } = useRoomBattle(roomId);
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!isPolling || !roomId) return;

    const interval = setInterval(() => {
      refetch();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPolling, roomId, intervalMs, refetch]);

  return { 
    battle, 
    loading, 
    error, 
    isPolling, 
    startPolling, 
    stopPolling, 
    refetch 
  };
};