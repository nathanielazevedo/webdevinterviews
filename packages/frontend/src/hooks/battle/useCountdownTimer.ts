import { useState, useEffect } from 'react';

/**
 * Custom hook to manage countdown timer for scheduled battles
 */
export const useCountdownTimer = (
  startTime: string | null, 
  status: string
): number | null => {
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);

  useEffect(() => {
    if (!startTime || status !== "waiting") {
      setTimeUntilStart(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const startTimeDate = new Date(startTime);
      const timeLeft = Math.max(
        0,
        Math.floor((startTimeDate.getTime() - now.getTime()) / 1000)
      );

      setTimeUntilStart(timeLeft);

      if (timeLeft === 0) {
        setTimeUntilStart(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, status]);

  return timeUntilStart;
};