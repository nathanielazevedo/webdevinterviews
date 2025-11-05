import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuestionAttempt {
  questionId: number;
  userId: string;
  completionTimeMs?: number;
  isSuccessful: boolean;
}

interface UserPerformanceData {
  questionId: number;
  fastestCompletionMs: number | null;
  totalAttempts: number;
  successfulAttempts: number;
  lastAttemptedAt: Date;
}

export class UserPerformanceService {
  /**
   * Record a user's attempt on a question
   */
  static async recordQuestionAttempt(attempt: QuestionAttempt): Promise<UserPerformanceData> {
    const { questionId, userId, completionTimeMs, isSuccessful } = attempt;

    const existingPerformance = await prisma.userQuestionPerformance.findUnique({
      where: {
        user_id_question_id: {
          user_id: userId,
          question_id: questionId,
        },
      },
    });

    const updatedData = {
      user_id: userId,
      question_id: questionId,
      total_attempts: existingPerformance ? existingPerformance.total_attempts + 1 : 1,
      successful_attempts: existingPerformance 
        ? existingPerformance.successful_attempts + (isSuccessful ? 1 : 0)
        : (isSuccessful ? 1 : 0),
      last_attempted_at: new Date(),
      fastest_completion_ms: existingPerformance?.fastest_completion_ms || null,
    };

    // Update fastest time if this was successful and faster than previous best
    if (isSuccessful && completionTimeMs) {
      if (!existingPerformance?.fastest_completion_ms || 
          completionTimeMs < existingPerformance.fastest_completion_ms) {
        updatedData.fastest_completion_ms = completionTimeMs;
      }
    }

    const performance = await prisma.userQuestionPerformance.upsert({
      where: {
        user_id_question_id: {
          user_id: userId,
          question_id: questionId,
        },
      },
      update: updatedData,
      create: updatedData,
    });

    return {
      questionId: performance.question_id,
      fastestCompletionMs: performance.fastest_completion_ms,
      totalAttempts: performance.total_attempts,
      successfulAttempts: performance.successful_attempts,
      lastAttemptedAt: performance.last_attempted_at,
    };
  }

  /**
   * Get user's performance for a specific question
   */
  static async getUserQuestionPerformance(userId: string, questionId: number): Promise<UserPerformanceData | null> {
    const performance = await prisma.userQuestionPerformance.findUnique({
      where: {
        user_id_question_id: {
          user_id: userId,
          question_id: questionId,
        },
      },
    });

    if (!performance) {
      return null;
    }

    return {
      questionId: performance.question_id,
      fastestCompletionMs: performance.fastest_completion_ms,
      totalAttempts: performance.total_attempts,
      successfulAttempts: performance.successful_attempts,
      lastAttemptedAt: performance.last_attempted_at,
    };
  }

  /**
   * Get user's performance across all questions
   */
  static async getUserOverallPerformance(userId: string): Promise<UserPerformanceData[]> {
    const performances = await prisma.userQuestionPerformance.findMany({
      where: {
        user_id: userId,
      },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        last_attempted_at: 'desc',
      },
    });

    return performances.map(performance => ({
      questionId: performance.question_id,
      fastestCompletionMs: performance.fastest_completion_ms,
      totalAttempts: performance.total_attempts,
      successfulAttempts: performance.successful_attempts,
      lastAttemptedAt: performance.last_attempted_at,
    }));
  }

  /**
   * Get leaderboard for a specific question (fastest completion times)
   */
  static async getQuestionLeaderboard(questionId: number, limit: number = 10) {
    const performances = await prisma.userQuestionPerformance.findMany({
      where: {
        question_id: questionId,
        fastest_completion_ms: {
          not: null,
        },
      },
      orderBy: {
        fastest_completion_ms: 'asc',
      },
      take: limit,
    });

    return performances.map((performance, index) => ({
      rank: index + 1,
      userId: performance.user_id,
      completionTimeMs: performance.fastest_completion_ms!,
      totalAttempts: performance.total_attempts,
      successfulAttempts: performance.successful_attempts,
    }));
  }

  /**
   * Get user's best times across multiple questions
   */
  static async getUserBestTimes(userId: string, questionIds: number[]): Promise<Record<number, number | null>> {
    const performances = await prisma.userQuestionPerformance.findMany({
      where: {
        user_id: userId,
        question_id: {
          in: questionIds,
        },
      },
      select: {
        question_id: true,
        fastest_completion_ms: true,
      },
    });

    const bestTimes: Record<number, number | null> = {};
    
    // Initialize all question IDs with null
    questionIds.forEach(id => {
      bestTimes[id] = null;
    });

    // Fill in actual best times
    performances.forEach(performance => {
      bestTimes[performance.question_id] = performance.fastest_completion_ms;
    });

    return bestTimes;
  }
}

export default UserPerformanceService;