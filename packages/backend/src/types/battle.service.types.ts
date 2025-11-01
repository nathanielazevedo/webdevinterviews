/**
 * Backend-specific battle service types
 * These are not shared with frontend - they're internal to backend logic
 */

export interface BattleCreateOptions {
  scheduledStartTime?: string;
  durationMinutes?: number;
}

export interface UserStats {
  total_battles: number;
  wins: number;
  win_rate: number;
  avg_tests_passed: number;
  total_tests_passed: number;
  best_placement: number | undefined;
  recent_battles: number;
}