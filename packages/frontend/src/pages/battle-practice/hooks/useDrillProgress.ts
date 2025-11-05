import { useState, useEffect } from 'react';

export const useDrillProgress = () => {
  const [drillProgress, setDrillProgress] = useState<
    Record<string, "completed" | "failed" | "pending">
  >({});

  // Load drill progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("battleDrillProgress");
    if (savedProgress) {
      setDrillProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save drill progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("battleDrillProgress", JSON.stringify(drillProgress));
  }, [drillProgress]);

  return {
    drillProgress,
    setDrillProgress,
  };
};