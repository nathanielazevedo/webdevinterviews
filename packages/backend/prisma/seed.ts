import { prisma } from '../src/config/database.js';
import { QuestionsService } from '../src/services/questions.service.js';
import { logger } from '../src/utils/logger.js';

const log = logger;

async function main() {
  log.info('🌱 Starting database seeding...');
  
  try {
    // Seed questions
    await QuestionsService.seedQuestions();
    log.info('✅ Questions seeded successfully');
    
  } catch (error) {
    log.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    log.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });