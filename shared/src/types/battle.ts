// Question-related types based on backend structure
export interface Question {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem_statement: string;
  function_signature: string;
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

// Battle timing types  
export interface BattleDetails {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  scheduledStartTime?: string | null;
  startedAt?: string | null;
  autoEndTime?: string | null;
  durationMinutes?: number | null;
  endedBy?: string | null;
  isAdmin: boolean;
  participantCount: number;
}

// Additional WebSocket message types for questions and timing
export interface GetCurrentQuestionMessage {
  type: 'get-current-question';
}

export interface GetQuestionPoolMessage {
  type: 'get-question-pool';
}

export interface CreateBattleMessage {
  type: 'create-battle';
  scheduledStartTime?: string;
  durationMinutes?: number;
}

export interface UpdateBattleTimingMessage {
  type: 'update-battle-timing';
  scheduledStartTime?: string;
  durationMinutes?: number;
}

export interface GetBattleInfoMessage {
  type: 'get-battle-info';
}

// WebSocket response types
export interface CurrentQuestionResponse {
  type: 'current-question';
  question: Question | null;
}

export interface QuestionPoolResponse {
  type: 'question-pool';
  questions: QuestionSummary[];
}

export interface BattleCreatedResponse {
  type: 'battle-created';
  battleId: string;
  scheduledStartTime?: string | null;
  durationMinutes?: number | null;
  status: string;
}

export interface BattleTimingUpdatedResponse {
  type: 'battle-timing-updated';
  battleId: string;
  scheduledStartTime?: string | null;
  durationMinutes?: number | null;
}

export interface BattleInfoResponse {
  type: 'battle-info';
  battle: BattleDetails | null;
}

// Enhanced battle started response with timing
export interface BattleStartedResponse {
  type: 'battle-started';
  battleId: string;
  startedAt: string;
  autoEndTime?: string | null;
  durationMinutes?: number | null;
  startedBy?: string;
}