/**
 * WebSocket message types shared between frontend and backend
 */

export interface WebSocketMessage {
  type: string;
  userId?: string;
  testsPassed?: number;
  scheduledStartTime?: string;
  durationMinutes?: number;
  completionTime?: number;
}

export interface PlayerData {
  testsPassed: number;
  joinedAt: string;
}

export interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests?: number;
  completionTime?: number | null;
  completedAt?: string;
  placement?: number;
}