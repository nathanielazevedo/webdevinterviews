import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import type { Question } from '@webdevinterviews/shared';

export interface UseBattlePracticeReturn {
  questions: Question[];
  nextBattleQuestions: Question[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing battle practice questions
 */
export const useBattlePractice = (): UseBattlePracticeReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextBattleQuestions, setNextBattleQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllQuestions();
      setQuestions(response.data?.questions || []);
      setNextBattleQuestions(response.data?.nextBattleQuestions || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    nextBattleQuestions,
    loading,
    error,
    refetch: fetchQuestions,
  };
};