import { Typography, Divider } from "@mui/material";
import Item from "../../../components/Item";
import { useAuth } from "../../../contexts/AuthContext";

const List = ({ headerText, items, basePath }) => {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] || "Anonymous";
  const isRandom = basePath.includes("random");

  items.forEach((item, index) => {
    if (displayName) {
      item.visible = true;
    } else if (index <= 4) {
      item.visible = true;
    }
  });

  if (isRandom) {
    return (
      <>
        <div className="items-container">
          <Item
            item={{
              title: "Random Questions",
              visible: displayName,
              id: "r",
              description: "From our question pool.",
            }}
            basePath={basePath}
            className="no-line"
          />
        </div>
        <Divider sx={{ marginTop: "20px" }}>OR</Divider>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Typography color={"text.secondary"}>
            Random questions deck by deck.
          </Typography>
          <Typography variant="caption" color={"text.secondary"} noWrap>
            {items.length} DECKS
          </Typography>
        </div>

        <div className="items-container">
          {items.map((item, index) => {
            return <Item key={index} item={item} basePath={basePath} />;
          })}
        </div>
      </>
    );
  } else {
    return (
      <>
        <Typography color={"text.secondary"}>{headerText}</Typography>
        <div className="items-container">
          {items.map((item, index) => {
            return <Item key={index} item={item} basePath={basePath} />;
          })}
        </div>
      </>
    );
  }
};

export default List;
