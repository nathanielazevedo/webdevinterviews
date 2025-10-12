import { useState, useCallback } from 'react';
import { components } from '@webdevinterviews/shared';

type Question = components['schemas']['Question'];
type QuestionSummary = components['schemas']['QuestionSummary'];

export const useBattleQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionPool, setQuestionPool] = useState<QuestionSummary[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Update current question
  const updateCurrentQuestion = useCallback((question: Question | null) => {
    setCurrentQuestion(question);
    setQuestionLoading(false);
    setQuestionError(null);
  }, []);

  // Update question pool
  const updateQuestionPool = useCallback((questions: QuestionSummary[]) => {
    setQuestionPool(questions);
    setQuestionLoading(false);
    setQuestionError(null);
  }, []);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setQuestionLoading(loading);
    if (loading) {
      setQuestionError(null);
    }
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setQuestionError(error);
    setQuestionLoading(false);
  }, []);

  // Reset questions state
  const resetQuestions = useCallback(() => {
    setCurrentQuestion(null);
    setQuestionPool([]);
    setQuestionLoading(false);
    setQuestionError(null);
  }, []);

  return {
    // State
    currentQuestion,
    questionPool,
    questionLoading,
    questionError,

    // Actions
    updateCurrentQuestion,
    updateQuestionPool,
    setLoading,
    setError,
    resetQuestions,

    // Computed values
    hasQuestions: questionPool.length > 0,
    hasCurrentQuestion: currentQuestion !== null,
  };
};