import { Outlet } from "react-router-dom";
import TopNav from "./RootTopNav";
import { Divider } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "../pages/portfolio/components";

const Root = () => (
  <>
    <Analytics />
    <Navbar />
    <Divider />
    <main className="main">
      <Outlet />
    </main>
  </>
);

export default Root;
