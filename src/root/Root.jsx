import { Outlet } from "react-router-dom";
import TopNav from "./RootTopNav";
import { Divider } from "@mui/material";

const Root = () => (
  <>
    <TopNav />
    <Divider />
    <main className="main">
      <Outlet />
    </main>
  </>
);

export default Root;
