// Database model types for the Web Dev Interviews application

import type { BattleResult } from './websocket-messages';

export interface Battle {
  id: string;
  room_id: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  participants: BattleParticipant[];
  results?: BattleResult[];
  admin_user_id?: string;
  scheduled_start_time?: string;
  auto_end_time?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface BattleParticipant {
  id?: string;
  battle_id?: string;
  userId: string;
  user_id?: string;
  placement?: number;
  testsPassed: number;
  totalTests: number;
  score?: number;
  completion_time?: number;
  joinedAt: string;
  created_at?: string;
}

export interface BattleStats {
  user_id: string;
  total_battles: number;
  wins: number;
  second_place: number;
  third_place: number;
  average_placement: number;
  average_tests_passed: number;
  best_score: number;
  average_completion_time: number;
}