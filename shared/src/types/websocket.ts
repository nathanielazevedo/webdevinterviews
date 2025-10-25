/**
 * WebSocket message types shared between frontend and backend
 */

export interface WebSocketMessage {
  type: string;
  userId?: string;
  passed?: number;
  total?: number;
  scheduledStartTime?: string;
  durationMinutes?: number;
  completionTime?: number;
}

export interface PlayerData {
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
}

export interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests: number;
  completionTime?: number | null;
}