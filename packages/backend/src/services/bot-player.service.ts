import { logger } from '../utils/logger.js';
import { 
  BOT_CONFIG, 
  BOT_SKILL_CONFIG, 
  getRandomBotProfile, 
  getRandomSkillLevel,
  isBot,
  type BotProfile
} from '../utils/bot-config.js';
import { BattleParticipationService } from './battle-participation.service.js';

const log = logger;

interface ActiveBot {
  profile: BotProfile;
  battleId: string;
  joinedAt: Date;
  performanceTimer: NodeJS.Timeout | null;
  currentTestsPassed: number;
  totalTests: number;
}

/**
 * BotPlayer Service
 * Manages bot players in battles - spawning, behavior simulation, and cleanup
 */
export class BotPlayerService {
  private static activeBots: Map<string, ActiveBot> = new Map();
  private static usedBotIds: Set<string> = new Set();

  /**
   * Check if bots should be spawned for a battle
   */
  static shouldSpawnBots(realPlayerCount: number, currentTotalPlayers: number): boolean {
    // Don't spawn if we already have enough players
    if (currentTotalPlayers >= BOT_CONFIG.TARGET_TOTAL_PLAYERS) {
      return false;
    }

    // Don't spawn if we have enough real players
    if (realPlayerCount >= BOT_CONFIG.TARGET_TOTAL_PLAYERS) {
      return false;
    }

    // Spawn bots if we have at least the minimum real players
    return realPlayerCount >= BOT_CONFIG.MIN_REAL_PLAYERS_BEFORE_BOTS;
  }

  /**
   * Calculate how many bots to spawn
   */
  static calculateBotsNeeded(realPlayerCount: number, currentBotCount: number): number {
    const totalPlayers = realPlayerCount + currentBotCount;
    const botsNeeded = Math.max(0, BOT_CONFIG.TARGET_TOTAL_PLAYERS - totalPlayers);
    
    // Cap at max bots per battle
    return Math.min(botsNeeded, BOT_CONFIG.MAX_BOTS_PER_BATTLE - currentBotCount);
  }

  /**
   * Spawn bots for a battle
   */
  static async spawnBotsForBattle(
    battleId: string, 
    realPlayerCount: number,
    totalTests: number = 10
  ): Promise<BotProfile[]> {
    try {
      const currentBotCount = Array.from(this.activeBots.values())
        .filter(bot => bot.battleId === battleId).length;
      
      const botsNeeded = this.calculateBotsNeeded(realPlayerCount, currentBotCount);
      
      if (botsNeeded <= 0) {
        log.info('No bots needed for battle', { battleId, realPlayerCount, currentBotCount });
        return [];
      }

      log.info(`Spawning ${botsNeeded} bots for battle ${battleId}`);
      
      const spawnedBots: BotProfile[] = [];
      
      for (let i = 0; i < botsNeeded; i++) {
        // Get random skill level and bot profile
        const skillLevel = getRandomSkillLevel();
        let botProfile = getRandomBotProfile(skillLevel);
        
        // Ensure we don't use the same bot twice in this battle
        let attempts = 0;
        while (this.usedBotIds.has(botProfile.id) && attempts < 20) {
          botProfile = getRandomBotProfile(skillLevel);
          attempts++;
        }
        
        this.usedBotIds.add(botProfile.id);
        
        // Add bot to participation
        await BattleParticipationService.addParticipant(botProfile.id);
        
        // Track active bot
        this.activeBots.set(botProfile.id, {
          profile: botProfile,
          battleId,
          joinedAt: new Date(),
          performanceTimer: null,
          currentTestsPassed: 0,
          totalTests
        });
        
        spawnedBots.push(botProfile);
        
        log.info(`Bot spawned: ${botProfile.username} (${skillLevel}) for battle ${battleId}`);
      }
      
      return spawnedBots;
    } catch (error) {
      log.error('Error spawning bots:', error);
      return [];
    }
  }

  /**
   * Start bot performance simulation for active battle
   */
  static startBotSimulation(battleId: string, totalTests: number): void {
    const botsInBattle = Array.from(this.activeBots.entries())
      .filter(([_, bot]) => bot.battleId === battleId);
    
    botsInBattle.forEach(([botId, _bot]) => {
      this.simulateBotPerformance(botId, totalTests);
    });
    
    log.info(`Started simulation for ${botsInBattle.length} bots in battle ${battleId}`);
  }

  /**
   * Simulate bot coding performance over time
   */
  private static simulateBotPerformance(botId: string, totalTests: number): void {
    const bot = this.activeBots.get(botId);
    if (!bot) return;

    const skillConfig = BOT_SKILL_CONFIG[bot.profile.skillLevel];
    
    // Calculate target tests passed
    const passRate = skillConfig.minTestsPassed + 
      Math.random() * (skillConfig.maxTestsPassed - skillConfig.minTestsPassed);
    const targetTestsPassed = Math.floor(totalTests * passRate);
    
    // Calculate completion time
    const completionTime = skillConfig.minCompletionTime + 
      Math.random() * (skillConfig.maxCompletionTime - skillConfig.minCompletionTime);
    
    // Number of updates (bot will gradually pass more tests)
    const numUpdates = Math.floor(3 + Math.random() * 4); // 3-6 updates
    const timeBetweenUpdates = (completionTime * 1000) / numUpdates;
    
    log.info(`Bot ${bot.profile.username} will pass ${targetTestsPassed}/${totalTests} tests over ${completionTime}s`);
    
    let updateCount = 0;
    
    const simulationInterval = setInterval(async () => {
      updateCount++;
      
      // Calculate tests passed for this update (progressive)
      const progress = updateCount / numUpdates;
      const testsPassed = Math.floor(targetTestsPassed * progress);
      
      // Update bot's progress
      bot.currentTestsPassed = testsPassed;
      
      try {
        await BattleParticipationService.updateParticipation(botId, testsPassed);
        log.debug(`Bot ${bot.profile.username} progress: ${testsPassed}/${totalTests} tests`);
      } catch (error) {
        log.error(`Error updating bot ${botId} participation:`, error);
      }
      
      // Stop after all updates or if bot removed
      if (updateCount >= numUpdates || !this.activeBots.has(botId)) {
        clearInterval(simulationInterval);
        if (bot.performanceTimer) {
          bot.performanceTimer = null;
        }
        log.info(`Bot ${bot.profile.username} finished simulation with ${testsPassed}/${totalTests} tests passed`);
      }
    }, timeBetweenUpdates);
    
    bot.performanceTimer = simulationInterval;
  }

  /**
   * Remove a specific bot from battle
   */
  static async removeBot(botId: string): Promise<boolean> {
    const bot = this.activeBots.get(botId);
    if (!bot) return false;

    // Stop performance simulation
    if (bot.performanceTimer) {
      clearInterval(bot.performanceTimer);
    }

    // Remove from tracking
    this.activeBots.delete(botId);
    this.usedBotIds.delete(botId);

    log.info(`Bot removed: ${bot.profile.username} from battle ${bot.battleId}`);
    return true;
  }

  /**
   * Remove bots from a battle (e.g., when real players join)
   */
  static async removeBotsFromBattle(battleId: string, count: number = 1): Promise<number> {
    const botsInBattle = Array.from(this.activeBots.entries())
      .filter(([_, bot]) => bot.battleId === battleId);
    
    let removed = 0;
    for (let i = 0; i < Math.min(count, botsInBattle.length); i++) {
      const [botId] = botsInBattle[i];
      if (await this.removeBot(botId)) {
        removed++;
      }
    }
    
    log.info(`Removed ${removed} bots from battle ${battleId}`);
    return removed;
  }

  /**
   * Clean up all bots for a completed battle
   */
  static async cleanupBattle(battleId: string): Promise<void> {
    const botsInBattle = Array.from(this.activeBots.entries())
      .filter(([_, bot]) => bot.battleId === battleId);
    
    for (const [botId] of botsInBattle) {
      await this.removeBot(botId);
    }
    
    log.info(`Cleaned up ${botsInBattle.length} bots for battle ${battleId}`);
  }

  /**
   * Get all active bots in a battle
   */
  static getBotsInBattle(battleId: string): BotProfile[] {
    return Array.from(this.activeBots.values())
      .filter(bot => bot.battleId === battleId)
      .map(bot => bot.profile);
  }

  /**
   * Get bot count in a battle
   */
  static getBotCount(battleId: string): number {
    return Array.from(this.activeBots.values())
      .filter(bot => bot.battleId === battleId).length;
  }

  /**
   * Check if a user is a bot
   */
  static isBot(userId: string): boolean {
    return isBot(userId);
  }

  /**
   * Get bot info if exists
   */
  static getBotInfo(botId: string): ActiveBot | undefined {
    return this.activeBots.get(botId);
  }
}
