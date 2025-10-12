import { Outlet } from "react-router-dom";
import { Divider } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "../pages/portfolio/components";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const Root = () => (
  <>
    <Analytics />
    <Navbar />
    <Divider />
    <main className="main">
      <Outlet />
    </main>
    <FloatingThemeToggle />
  </>
);

export default Root;
