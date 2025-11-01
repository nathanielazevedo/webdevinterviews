import React, { createContext, useContext, useMemo } from "react";
import { Player, Question, QuestionSummary } from "@webdevinterviews/shared";
import { useBattle } from "../hooks/battle/index";

interface PlayerResults {
  [playerId: string]: {
    passed: number;
    total: number;
    completedAt: string | null;
    isCompleted: boolean;
  };
}

interface BattleContextType {
  battle: {
    id: string | null;
    status: "waiting" | "active" | "completed" | "no-battle";
    info: any;
    playerResults: any;
    isAdmin: boolean;
    startTime: string | null;
    error: string | null;
    loading: boolean;
    currentQuestion: any;
    questionPool: any[];
    questionLoading: boolean;
  };
  players: Player[];
  currentPlayerId?: string;
  isConnected: boolean;
  handleStartBattle: () => void;
  handleTestResults: (results: {
    passed: boolean;
    message: string;
    testCases: unknown[];
    totalExecutionTime: number;
  }) => void;
  handleEndBattle: () => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const battleData = useBattle();
  // Memoize the context value - just pass through battle and players
  const contextValue = useMemo(
    () => ({
      battle: battleData.battle,
      players: battleData.players,
      currentPlayerId: battleData.currentPlayerId,
      isConnected: battleData.isConnected,
      handleStartBattle: battleData.handleStartBattle,
      handleTestResults: battleData.handleTestResults,
      handleEndBattle: battleData.handleEndBattle,
    }),
    [
      battleData.battle,
      battleData.players,
      battleData.currentPlayerId,
      battleData.isConnected,
      battleData.handleStartBattle,
      battleData.handleTestResults,
      battleData.handleEndBattle,
    ]
  );

  return (
    <BattleContext.Provider value={contextValue}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = () => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error("useBattleContext must be used within a BattleProvider");
  }
  return context;
};
