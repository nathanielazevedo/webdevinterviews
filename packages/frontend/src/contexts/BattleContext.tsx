import React, { createContext, useContext, useMemo } from "react";
import { Player, Battle } from "@webdevinterviews/shared";
import { useBattle } from "../hooks/battle/index";

interface BattleContextType {
  battle: Battle | null;
  isAdmin: boolean;
  error: string | null;
  loading: boolean;
  players: Player[];
  currentPlayerId?: string;
  isConnected: boolean;
  handleStartBattle: () => void;
  handleTestResults: (results: {
    passed: boolean;
    message: string;
    testCases: unknown[];
    totalExecutionTime: number;
    testsPassed: number;
  }) => void;
  handleEndBattle: () => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const battleData = useBattle();
  // Memoize the context value - pass through all battle data
  const contextValue = useMemo(
    () => ({
      battle: battleData.battle,
      isAdmin: battleData.isAdmin,
      error: battleData.error,
      loading: battleData.loading,
      players: battleData.players,
      currentPlayerId: battleData.currentPlayerId,
      isConnected: battleData.isConnected,
      handleStartBattle: battleData.handleStartBattle,
      handleTestResults: battleData.handleTestResults,
      handleEndBattle: battleData.handleEndBattle,
    }),
    [
      battleData.battle,
      battleData.isAdmin,
      battleData.error,
      battleData.loading,
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
