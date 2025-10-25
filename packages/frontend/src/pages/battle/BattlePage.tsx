import React from "react";
import { BattleProvider } from "../../contexts/BattleContext";
import BattleMain from "./BattleMain";

const BattlePage: React.FC = () => {
  console.log("BattlePage render");
  return (
    <BattleProvider>
      <BattleMain />
    </BattleProvider>
  );
};

export default BattlePage;
