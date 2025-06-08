import { Outlet } from "react-router-dom";
import TopNav from "./RootTopNav";
import { Divider } from "@mui/material";
import { Analytics } from "@vercel/analytics/next";

const Root = () => (
  <>
    <Analytics />
    <TopNav />
    <Divider />
    <main className="main">
      <Outlet />
    </main>
  </>
);

export default Root;
