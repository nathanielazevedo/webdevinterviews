import { prisma } from '../config/database.js';
import type { Question } from '@webdevinterviews/shared';
import { LEETCODE_75_QUESTIONS } from '../data/questions.data.js';
import { logger } from '../utils/logger.js';

const log = logger;

export class QuestionsService {
  
  // Initialize the database with LeetCode 75 questions
  static async seedQuestions(): Promise<Question[]> {
    try {
      // Check if questions already exist
      const existingQuestions = await prisma.question.findMany({
        take: 1
      });

      if (existingQuestions.length > 0) {
        log.info('Questions already seeded, skipping seed');
        return existingQuestions as unknown as Question[];
      }

      // Insert all questions
      await prisma.question.createMany({
        data: LEETCODE_75_QUESTIONS
      });

      // Get the inserted questions
      const questions = await prisma.question.findMany({
        orderBy: { created_at: 'desc' },
        take: LEETCODE_75_QUESTIONS.length
      });

      log.info('Successfully seeded questions', { count: questions.length });
      return questions as unknown as Question[];
    } catch (error) {
      log.error('Failed to seed questions', error);
      throw error;
    }
  }

  // Get random questions for a battle pool
  static async getRandomQuestions(count: number = 10): Promise<Question[]> {
    try {
      // Get random questions using Prisma's random ordering
      const questions = await prisma.question.findMany({
        take: count * 2, // Get more than needed for better randomization
        orderBy: {
          id: 'desc' // Use a more predictable ordering
        }
      });

      // Shuffle the results to make them more random
      const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, count);
      
      log.info('Retrieved random questions', { count: shuffled.length });
      return shuffled as unknown as Question[];
    } catch (error) {
      log.error('Failed to get random questions', error);
      throw error;
    }
  }

  // Create a question pool for a specific battle
  static async createBattleQuestionPool(battleId: string, questionCount: number = 10): Promise<void> {
    log.info('Creating battle question pool', { battleId, questionCount });
    
    try {
      // Check if pool already exists
      const existingPool = await prisma.battleQuestionPool.findMany({
        where: { battle_id: battleId },
        take: 1
      });

      if (existingPool.length > 0) {
        log.info('Battle question pool already exists', { battleId });
        return;
      }

      // Get random questions
      const questions = await this.getRandomQuestions(questionCount);
      
      if (questions.length === 0) {
        throw new Error('No questions available to create battle pool');
      }

      // Create battle question pool entries
      const battleQuestions = questions.map(question => ({
        battle_id: battleId,
        question_id: question.id as number,
        is_current: false
      }));

      await prisma.battleQuestionPool.createMany({
        data: battleQuestions
      });

      log.info('Battle question pool created successfully', { 
        battleId, 
        questionsCount: battleQuestions.length 
      });
    } catch (error) {
      log.error('Failed to create battle question pool', error);
      throw error;
    }
  }

  // Get all questions in a battle's pool
  static async getBattleQuestionPool(battleId: string): Promise<Question[]> {
    log.info('Getting battle question pool', { battleId });
    
    try {
      const battleQuestionPools = await prisma.battleQuestionPool.findMany({
        where: { battle_id: battleId },
        include: { question: true },
        orderBy: { id: 'asc' }
      });

      const questions = battleQuestionPools.map(bqp => bqp.question);

      return questions as unknown as Question[];
    } catch (error) {
      log.error('Failed to get battle question pool', error);
      throw error;
    }
  }

  // Select a random question from the battle's pool to be the current question
  static async selectBattleQuestion(battleId: string): Promise<Question> {
    log.info('Selecting battle question', { battleId });

    try {
      // Get all questions in the battle's pool
      const poolQuestions = await this.getBattleQuestionPool(battleId);

      if (poolQuestions.length === 0) {
        throw new Error('No questions found in battle pool');
      }

      // Select a random question
      const selectedQuestion = poolQuestions[Math.floor(Math.random() * poolQuestions.length)];

      // Update the battle's current question
      await prisma.battle.update({
        where: { id: battleId },
        data: { selected_question_id: selectedQuestion.id as number }
      });

      log.info('Battle question selected', {
        battleId,
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title
      });

      return selectedQuestion;
    } catch (error) {
      log.error('Failed to select battle question', error);
      throw error;
    }
  }

  // Get the current question for a battle
  static async getCurrentBattleQuestion(battleId: string): Promise<Question | null> {
    log.info('Getting current battle question', { battleId });

    try {
      // Get the battle's current question ID
      const battle = await prisma.battle.findUnique({
        where: { id: battleId },
        select: { selected_question_id: true }
      });

      if (!battle?.selected_question_id) {
        log.info('No current question set for battle', { battleId });
        return null;
      }

      // Get the question details
      const question = await this.getQuestionById(battle.selected_question_id.toString());

      if (question) {
        log.info('Current battle question retrieved', {
          battleId,
          questionId: question.id,
          questionTitle: question.title
        });
      }

      return question;
    } catch (error) {
      log.error('Failed to get current battle question', error);
      throw error;
    }
  }

  // Get a question by ID
  static async getQuestionById(questionId: string): Promise<Question | null> {
    log.info('Getting question by ID', { questionId });
    
    try {
      const question = await prisma.question.findUnique({
        where: { id: parseInt(questionId) }
      });

      if (!question) {
        log.info('Question not found', { questionId });
        return null;
      }

      log.info('Question retrieved by ID', { 
        questionId, 
        questionTitle: question.title 
      });

      return question as unknown as Question;
    } catch (error) {
      log.error('Failed to get question by ID', error);
      throw error;
    }
  }

  // Get all questions
  static async getAllQuestions(): Promise<Question[]> {
    log.info('Getting all questions');
    
    try {
      const questions = await prisma.question.findMany({
        orderBy: { created_at: 'asc' }
      });

      log.info('All questions retrieved', { count: questions.length });
      return questions as unknown as Question[];
    } catch (error) {
      log.error('Failed to get all questions', error);
      throw error;
    }
  }

  // Create a new question
  static async createQuestion(questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> {
    log.info('Creating new question', { title: questionData.title });
    
    try {
      const question = await prisma.question.create({
        data: questionData
      });

      log.info('Question created successfully', { 
        questionId: question.id,
        title: question.title 
      });

      return question as unknown as Question;
    } catch (error) {
      log.error('Failed to create question', error);
      throw error;
    }
  }

  // Update a question
  static async updateQuestion(
    questionId: string, 
    updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Question> {
    log.info('Updating question', { questionId, updates: Object.keys(updates) });
    
    try {
      const question = await prisma.question.update({
        where: { id: parseInt(questionId) },
        data: updates
      });

      log.info('Question updated successfully', { 
        questionId: question.id,
        title: question.title 
      });

      return question as unknown as Question;
    } catch (error) {
      log.error('Failed to update question', error);
      throw error;
    }
  }

  // Delete a question
  static async deleteQuestion(questionId: string): Promise<void> {
    log.info('Deleting question', { questionId });
    
    try {
      await prisma.question.delete({
        where: { id: parseInt(questionId) }
      });

      log.info('Question deleted successfully', { questionId });
    } catch (error) {
      log.error('Failed to delete question', error);
      throw error;
    }
  }
}