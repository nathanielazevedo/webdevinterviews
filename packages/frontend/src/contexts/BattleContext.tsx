import React, { createContext, useContext, useMemo } from "react";
import {
  Player,
  Battle,
  AttackType,
  UserWallet,
  UserAttack,
} from "@webdevinterviews/shared";
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
  // Attack system
  availableAttacks: AttackType[];
  userWallet: UserWallet | null;
  userInventory: UserAttack[];
  attacksLoading: boolean;
  attacksError: string | null;
  fetchAvailableAttacks: () => Promise<void>;
  fetchUserWallet: () => Promise<void>;
  fetchUserInventory: () => Promise<void>;
  refreshAttackData: () => Promise<void>;
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
      // Attack system
      availableAttacks: battleData.availableAttacks,
      userWallet: battleData.userWallet,
      userInventory: battleData.userInventory,
      attacksLoading: battleData.attacksLoading,
      attacksError: battleData.attacksError,
      fetchAvailableAttacks: battleData.fetchAvailableAttacks,
      fetchUserWallet: battleData.fetchUserWallet,
      fetchUserInventory: battleData.fetchUserInventory,
      refreshAttackData: battleData.refreshAttackData,
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
      battleData.availableAttacks,
      battleData.userWallet,
      battleData.userInventory,
      battleData.attacksLoading,
      battleData.attacksError,
      battleData.fetchAvailableAttacks,
      battleData.fetchUserWallet,
      battleData.fetchUserInventory,
      battleData.refreshAttackData,
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
