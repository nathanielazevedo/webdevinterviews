// New streamlined battle service that orchestrates focused services
import { BattleCoreService } from './battle-core.service.js';
import { BattleQueryService } from './battle-query.service.js';
import { BattleParticipationService } from './battle-participation.service.js';
import { BattleSchedulingService } from './battle-scheduling.service.js';
import { BattleStatsService } from './battle-stats.service.js';
import { QuestionsService } from './questions.service.js';

/**
 * Main Battle Service - orchestrates focused battle services
 * This replaces the massive 867-line monolithic service
 */
export class BattleService {
  
  // === Core Battle Lifecycle ===
  static getNextSaturday5pmEST = BattleCoreService.getNextSaturday5pmEST;
  static createBattle = BattleCoreService.createBattle;
  static createCurrentBattle = BattleCoreService.createCurrentBattle;
  static setAutoStartTime = BattleCoreService.setAutoStartTime;
  static startBattle = BattleCoreService.startBattle;
  static completeBattle = BattleCoreService.completeBattle;

  // === Battle Queries ===
  static getCurrentBattle = BattleQueryService.getCurrentBattle;
  static getActiveBattle = BattleQueryService.getActiveBattle;
  static getBattle = BattleQueryService.getBattle;
  static isAdminForBattle = BattleQueryService.isAdminForBattle;
  static getCompletedBattles = BattleQueryService.getCompletedBattles;

  // === Participation Management ===
  static createBattleParticipations = BattleParticipationService.createBattleParticipations;
  static updateParticipation = BattleParticipationService.updateParticipation;
  static getBattleParticipants = BattleParticipationService.getBattleParticipants;
  static getUserParticipationHistory = BattleParticipationService.getUserParticipationHistory;
  static updateConnectionStatus = BattleParticipationService.updateConnectionStatus;
  static getCurrentParticipation = BattleParticipationService.getCurrentParticipation;
  static addParticipant = BattleParticipationService.addParticipant;

  // === Scheduling & Auto-Management ===
  static getBattleToAutoStart = BattleSchedulingService.getBattleToAutoStart;
  static getBattleToAutoEnd = BattleSchedulingService.getBattleToAutoEnd;
  static autoStartBattle = BattleSchedulingService.autoStartBattle;
  static autoEndBattle = BattleSchedulingService.autoEndBattle;
  static updateBattleTiming = BattleSchedulingService.updateBattleTiming;

  // === User Statistics ===
  static getUserBattleHistory = BattleStatsService.getUserBattleHistory;
  static getUserStats = BattleStatsService.getUserStats;

  // === Question Management (delegated) ===
  static getCurrentBattleQuestion = QuestionsService.getCurrentBattleQuestion;
  static getBattleQuestionPool = QuestionsService.getBattleQuestionPool;
  static getQuestionById = QuestionsService.getQuestionById;

  // === Legacy Compatibility Methods ===
  // These maintain backward compatibility with existing code

  /**
   * Update battle participant data (legacy method)
   */
  static async updateBattleParticipant(
    userId: string, 
    testsPassed: number, 
    _totalTests: number
  ): Promise<void> {
    return BattleParticipationService.updateParticipation(userId, testsPassed);
  }

  /**
   * Add participant to battle (legacy method)
   */
  static async addParticipantToBattle(userId: string): Promise<void> {
    return BattleParticipationService.addParticipant(userId);
  }
}
