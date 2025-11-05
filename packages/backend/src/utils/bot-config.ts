/**
 * Bot Player Configuration
 * Defines realistic bot profiles for populating battles
 */

export type BotSkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface BotProfile {
  id: string; // Bot ID (valid UUID)
  username: string;
  skillLevel: BotSkillLevel;
  avatar?: string;
}

/**
 * Bot performance characteristics by skill level
 */
export const BOT_SKILL_CONFIG = {
  beginner: {
    // Time to complete (in seconds)
    minCompletionTime: 45,
    maxCompletionTime: 58,
    // Test pass rate
    minTestsPassed: 0.3, // 30% of tests
    maxTestsPassed: 0.6, // 60% of tests
    // Typing simulation
    typingSpeed: 1000, // ms between updates (slow)
    mistakeProbability: 0.3, // 30% chance of making mistakes
  },
  intermediate: {
    minCompletionTime: 25,
    maxCompletionTime: 45,
    minTestsPassed: 0.5,
    maxTestsPassed: 0.85,
    typingSpeed: 500,
    mistakeProbability: 0.15,
  },
  advanced: {
    minCompletionTime: 10,
    maxCompletionTime: 30,
    minTestsPassed: 0.7,
    maxTestsPassed: 1.0, // Can pass all tests
    typingSpeed: 300,
    mistakeProbability: 0.05,
  },
};

/**
 * Pool of realistic bot profiles
 * Names inspired by famous developers, computer scientists, and programmers
 * Using UUID format for database compatibility
 * Avatars use DiceBear API for consistent, deterministic avatars based on bot ID
 */
export const BOT_PROFILES: BotProfile[] = [
  // Beginner bots
  { id: '00000000-0000-0000-0000-000000000001', username: 'CodeNewbie_Alex', skillLevel: 'beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot001' },
  { id: '00000000-0000-0000-0000-000000000002', username: 'LearningDev_Sam', skillLevel: 'beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot002' },
  { id: '00000000-0000-0000-0000-000000000003', username: 'JuniorCoder_Riley', skillLevel: 'beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot003' },
  { id: '00000000-0000-0000-0000-000000000004', username: 'DevStudent_Jordan', skillLevel: 'beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot004' },
  { id: '00000000-0000-0000-0000-000000000005', username: 'Bootcamp_Casey', skillLevel: 'beginner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot005' },
  
  // Intermediate bots
  { id: '00000000-0000-0000-0000-000000000006', username: 'MidLevel_Taylor', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot006' },
  { id: '00000000-0000-0000-0000-000000000007', username: 'CodeCrafter_Morgan', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot007' },
  { id: '00000000-0000-0000-0000-000000000008', username: 'DevPro_Avery', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot008' },
  { id: '00000000-0000-0000-0000-000000000009', username: 'SoftwareEng_Blake', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot009' },
  { id: '00000000-0000-0000-0000-000000000010', username: 'FullStack_Quinn', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot010' },
  { id: '00000000-0000-0000-0000-000000000011', username: 'ReactDev_Skylar', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot011' },
  { id: '00000000-0000-0000-0000-000000000012', username: 'BackendPro_Drew', skillLevel: 'intermediate', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot012' },
  
  // Advanced bots
  { id: '00000000-0000-0000-0000-000000000013', username: 'AlgoMaster_Ada', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot013' },
  { id: '00000000-0000-0000-0000-000000000014', username: 'SeniorDev_Grace', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot014' },
  { id: '00000000-0000-0000-0000-000000000015', username: 'TechLead_Alan', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot015' },
  { id: '00000000-0000-0000-0000-000000000016', username: 'Architect_Linus', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot016' },
  { id: '00000000-0000-0000-0000-000000000017', username: 'CodeNinja_Dennis', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot017' },
  { id: '00000000-0000-0000-0000-000000000018', username: 'StaffEng_Ken', skillLevel: 'advanced', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot018' },
];

/**
 * Configuration for bot spawning
 */
export const BOT_CONFIG = {
  // Minimum players before spawning bots
  MIN_REAL_PLAYERS_BEFORE_BOTS: 1,
  
  // Target total players (real + bots)
  TARGET_TOTAL_PLAYERS: 4,
  
  // Max bots in a battle
  MAX_BOTS_PER_BATTLE: 3,
  
  // Delay between bot joins (ms) - makes it feel more natural
  BOT_JOIN_DELAY_MIN: 2000, // 2 seconds
  BOT_JOIN_DELAY_MAX: 8000, // 8 seconds
  
  // When to spawn bots (seconds into countdown)
  SPAWN_BOTS_AFTER_COUNTDOWN_STARTS: 5, // Wait 5s after countdown starts
  
  // Skill distribution (probabilities)
  SKILL_DISTRIBUTION: {
    beginner: 0.3, // 30% beginners
    intermediate: 0.5, // 50% intermediate
    advanced: 0.2, // 20% advanced
  },
};

/**
 * Helper to get random bot profile by skill level
 */
export function getRandomBotProfile(skillLevel?: BotSkillLevel): BotProfile {
  let profiles = BOT_PROFILES;
  
  if (skillLevel) {
    profiles = BOT_PROFILES.filter(bot => bot.skillLevel === skillLevel);
  }
  
  return profiles[Math.floor(Math.random() * profiles.length)];
}

/**
 * Helper to get random skill level based on distribution
 */
export function getRandomSkillLevel(): BotSkillLevel {
  const rand = Math.random();
  const { SKILL_DISTRIBUTION } = BOT_CONFIG;
  
  if (rand < SKILL_DISTRIBUTION.beginner) {
    return 'beginner';
  } else if (rand < SKILL_DISTRIBUTION.beginner + SKILL_DISTRIBUTION.intermediate) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

/**
 * Check if a userId is a bot
 * Bot UUIDs start with all zeros (00000000-0000-0000-0000-...)
 */
export function isBot(userId: string): boolean {
  return userId.startsWith('00000000-0000-0000-0000-');
}
