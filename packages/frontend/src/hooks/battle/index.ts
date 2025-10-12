// Individual battle hooks
export { useBattleState } from './useBattleState';
export { useBattlePlayers } from './useBattlePlayers';
export { useBattleQuestions } from './useBattleQuestions';
export { useBattleTimer } from './useBattleTimer';

// Enhanced unified hook
export { useBattleEnhanced } from './useBattleEnhanced';

// Re-export types
export type { BattleStatus, BattleState, BattleInfo } from './useBattleState';
export type { Player, WSPlayer, PlayerResults } from './useBattlePlayers';