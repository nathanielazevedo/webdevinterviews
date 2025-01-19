import games from "./games.json";
import Alert from "@mui/material/Alert";
import Header from "../../components/Header";
import Item from "../../components/Item";

const GamesList = () => {
  return (
    <div className="fit-wrapper">
      <Header
        title="Games"
        subtext="Improve your understanding of JavaScript with games."
      />
      <div className="items-container">
        {games.map((game, index) => (
          <Item key={index} item={game} basePath={"/games/"} />
        ))}
      </div>
    </div>
  );
};

export default GamesList;
