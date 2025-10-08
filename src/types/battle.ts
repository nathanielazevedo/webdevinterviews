// TypeScript interfaces for Battle API responses

export interface Player {
  userId: string;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
  isConnected: boolean;
}

export interface PlayersResponse {
  players: Player[];
}

export interface BattleInfo {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  startedAt: string | null;
  createdAt: string;
  adminUserId: string;
  participantCount: number;
  connectedPlayers: number;
  canJoin: boolean;
  isActive: boolean;
  isWaiting: boolean;
  isCompleted: boolean;
}

export interface BattleResponse {
  battle: BattleInfo | null;
  message?: string;
  canJoin?: boolean;
  status?: string;
}

export interface BattleHistoryItem {
  id: string;
  status: string;
  startedAt: string;
  createdAt: string;
  participants: Array<{
    userId: string;
    testsPassed: number;
    totalTests: number;
    placement?: number;
  }>;
}

export interface UserBattlesResponse {
  battles: BattleHistoryItem[];
}

export interface UserStats {
  totalBattles: number;
  wins: number;
  averageScore: number;
  bestScore: number;
  totalTestsPassed: number;
  totalTestsAttempted: number;
  winRate: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface RoomStatus {
  status: 'no-battle' | 'waiting' | 'active' | 'completed' | 'error';
  canJoin: boolean;
  connectedPlayers: number;
  isActive?: boolean;
  isWaiting?: boolean;
  isCompleted?: boolean;
  participantCount?: number;
  startedAt?: string;
  error?: string;
}

export interface RoomsStatusResponse {
  rooms: Record<string, RoomStatus>;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface BattleStatusMessage extends WebSocketMessage {
  type: 'battle-status';
  status: 'waiting' | 'active' | 'completed';
  isAdmin: boolean;
  battleId: string;
}

export interface BattleStartedMessage extends WebSocketMessage {
  type: 'battle-started';
  battleId: string;
  startedAt: string;
}

export interface BattleCompletedMessage extends WebSocketMessage {
  type: 'battle-completed';
  battleId: string;
  results: Array<{
    userId: string;
    testsPassed: number;
    totalTests: number;
    completionTime: number | null;
    placement: number;
  }>;
}

export interface TestResultsUpdateMessage extends WebSocketMessage {
  type: 'test-results-update';
  userId: string;
  passed: number;
  total: number;
}

export interface PlayersListMessage extends WebSocketMessage {
  type: 'players-list';
  players: Player[];
}

export interface RoomStatusUpdateMessage extends WebSocketMessage {
  type: 'room-status-update';
  roomId: string;
  status: string;
  canJoin: boolean;
  connectedPlayers: number;
  change?: string;
  isActive?: boolean;
  isWaiting?: boolean;
  isCompleted?: boolean;
  participantCount?: number;
  startedAt?: string;
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  message: string;
}