import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { api, type UserPerformanceData } from '../../../api/client';
import type { Question } from '@webdevinterviews/shared';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useUserPerformance = (displayedQuestions: Question[]) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPerformances, setUserPerformances] = useState<Record<number, UserPerformanceData>>({});
  const [loadingPerformances, setLoadingPerformances] = useState(false);

  // Get user authentication state
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user performance data for all questions when user is authenticated
  useEffect(() => {
    const loadUserPerformances = async () => {
      if (!userId || displayedQuestions.length === 0) return;

      setLoadingPerformances(true);
      try {
        const questionIds = displayedQuestions.map(q => q.id);
        const response = await api.getUserBestTimes(userId, questionIds);
        
        if (response.success && response.data) {
          // Get detailed performance data for each question that has a best time
          const performancePromises = Object.entries(response.data)
            .filter(([, bestTime]) => bestTime !== null)
            .map(async ([questionId]) => {
              const detailResponse = await api.getUserQuestionPerformance(userId, parseInt(questionId));
              return { questionId: parseInt(questionId), data: detailResponse.data };
            });

          const performanceResults = await Promise.all(performancePromises);
          
          const performancesMap: Record<number, UserPerformanceData> = {};
          performanceResults.forEach(({ questionId, data }) => {
            if (data) {
              performancesMap[questionId] = data;
            }
          });

          setUserPerformances(performancesMap);
        }
      } catch {
        // Silently handle error - don't interrupt user experience
        setUserPerformances({});
      } finally {
        setLoadingPerformances(false);
      }
    };

    loadUserPerformances();
  }, [userId, displayedQuestions]);

  return {
    userId,
    userPerformances,
    loadingPerformances,
  };
};