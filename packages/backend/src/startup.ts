import { QuestionsService } from './services/questions.service.js';
import { logger } from './utils/logger.js';

const log = logger;

/**
 * Initialize database and perform startup tasks
 */
export async function initializeDatabase(): Promise<void> {
  log.info('Initializing database...');
  
  try {
    await QuestionsService.seedQuestions();
    log.info('Database initialization completed successfully');
  } catch (error) {
    log.error('Failed to initialize questions database', error);
    throw error; // Re-throw to let caller decide how to handle
  }
}