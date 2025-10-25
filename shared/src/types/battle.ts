// Question-related types based on backend structure
export interface Question {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem_statement: string;
  function_signature?: string;
  test_cases: Array<{
    input?: Record<string, any>;
    expected?: any;
  }>;
  examples?: Array<{
    input?: string;
    output?: string;
    explanation?: string;
  }> | null;
  constraints?: string | null;
  hints?: string[] | null;
  tags?: string[] | null;
  leetcode_number?: number | null;
  starter_code?: string;
  solution?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionSummary {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_number?: number | null;
  tags?: string[] | null;
}

// Simplified battle types for new backend
export interface Battle {
  id: string;
  room_id?: string; // Legacy field for database compatibility
  status: 'waiting' | 'active' | 'completed';
  started_at?: string | null;
  completed_at?: string | null;
  duration_minutes?: number | null;
  admin_user_id?: string;
  scheduled_start_time?: string | null;
  auto_end_time?: string | null;
  created_at?: string;
  updated_at?: string;
  ended_by?: string | null;
  participants?: BattleParticipant[];
}

export interface BattleParticipant {
  userId: string;
  joinedAt: string;
  testsPassed?: number;
  totalTests?: number;
}

export interface Player {
  userId: string;
  username: string;
  avatar?: string;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
  isConnected: boolean;
}

// API Response types matching the new backend
export interface BattleCurrentResponse {
  battle?: Battle;
  questions?: QuestionSummary[];
}

export interface BattleInfo {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  startedAt?: string | null;
  createdAt?: string;
  scheduledStartTime?: string | null;
  durationMinutes?: number | null;
  adminUserId?: string;
  participantCount?: number;
  connectedPlayers?: number;
  canJoin?: boolean;
  isActive?: boolean;
  isWaiting?: boolean;
  isCompleted?: boolean;
  questionPool?: QuestionSummary[];
  selectedQuestion?: Question | null;
}

export interface BattlePlayersResponse {
  players: Player[];
}

export interface BattleStatusResponse {
  battle?: Battle | null;
  canJoin: boolean;
  message?: string;
}

// WebSocket message types for simplified backend
export interface JoinMessage {
  type: 'join';
  userId: string;
}

export interface StartBattleMessage {
  type: 'start-battle';
}

export interface TestResultsMessage {
  type: 'test-results';
  passed: number;
  total: number;
}

// WebSocket response types
export interface BattleStatusWsResponse {
  type: 'battle-status';
  status: string;
  isAdmin: boolean;
  battleId: string;
}

export interface BattleStartedResponse {
  type: 'battle-started';
  battleId: string;
  startedAt: string;
}

export interface PlayersListResponse {
  type: 'players-list';
  players: Player[];
}