import { prisma } from '../src/config/database.js';
import { QuestionsService } from '../src/services/questions.service.js';
import { logger } from '../src/utils/logger.js';

const log = logger;

async function resetAndSeedQuestions() {
  try {
    log.info('Starting database reset and question seeding...');

    // Step 1: Clear all existing questionss
    log.info('Clearing existing questions from database...');
    const deleteResult = await prisma.question.deleteMany();
    log.info(`Deleted ${deleteResult.count} existing questions`);

    // Step 2: Clear battle question pools (since they reference questions)
    log.info('Clearing battle question pools...');
    const deletePoolsResult = await prisma.battleQuestionPool.deleteMany();
    log.info(`Deleted ${deletePoolsResult.count} battle question pools`);

    // Step 3: Seed new questions
    log.info('Seeding new questionss...');
    const questions = await QuestionsService.seedQuestions();
    log.info(`Successfully seeded ${questions.length} questions`);

    // Step 4: Log the seeded questions
    log.info('Seeded questions:');
    questions.forEach((q, index) => {
      log.info(`${index + 1}. ${q.title} (${q.difficulty}) - LeetCode #${q.leetcode_number}`);
    });

    log.info('Database reset and seeding completed successfully!');

  } catch (error) {
    log.error('Error during database reset and seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
resetAndSeedQuestions()
  .then(() => {
    console.log('✅ Database reset and seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database reset and seeding failed:', error);
    process.exit(1);
  });