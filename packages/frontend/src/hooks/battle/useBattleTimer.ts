import { useState, useEffect, useCallback } from 'react';

export const useBattleTimer = () => {
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);
  const [battleStartTime, setBattleStartTime] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [battleTimeRemaining, setBattleTimeRemaining] = useState(900); // 15 minutes default

  // Countdown timer for scheduled battles
  useEffect(() => {
    if (!battleStartTime) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(battleStartTime).getTime();
      const timeLeft = Math.max(0, Math.floor((startTime - now) / 1000));
      
      setTimeUntilStart(timeLeft);
      
      if (timeLeft === 0) {
        setBattleStartTime(null);
        setTimeUntilStart(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [battleStartTime]);

  // Manual countdown logic (fallback for local testing)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown !== null && countdown > 0 && timeUntilStart === null) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (countdown === 0 && timeUntilStart === null) {
      setCountdown(null);
    }

    return () => clearInterval(interval);
  }, [countdown, timeUntilStart]);

  // Battle time remaining countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (battleTimeRemaining > 0) {
      interval = setInterval(() => {
        setBattleTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [battleTimeRemaining]);

  // Start manual countdown
  const startCountdown = useCallback((seconds: number) => {
    setCountdown(seconds);
  }, []);

  // Set scheduled battle start time
  const scheduleStart = useCallback((startTime: string) => {
    setBattleStartTime(startTime);
  }, []);

  // Reset all timers
  const resetTimers = useCallback(() => {
    setTimeUntilStart(null);
    setBattleStartTime(null);
    setCountdown(null);
    setBattleTimeRemaining(900);
  }, []);

  // Get effective countdown (WebSocket or manual)
  const effectiveCountdown = timeUntilStart !== null ? timeUntilStart : countdown;

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    timeUntilStart,
    battleStartTime,
    countdown,
    battleTimeRemaining,
    effectiveCountdown,

    // Setters
    setBattleStartTime,
    setBattleTimeRemaining,

    // Actions
    startCountdown,
    scheduleStart,
    resetTimers,

    // Utilities
    formatTime,

    // Computed values
    hasScheduledStart: battleStartTime !== null,
    hasActiveCountdown: effectiveCountdown !== null && effectiveCountdown > 0,
    isCountdownFinished: effectiveCountdown === 0,
  };
};