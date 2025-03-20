import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import TopNav from "./components/topnav";

const Layout: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    themeLink.href = `/themes/${newTheme}.css`;

    const customLink = document.getElementById(
      "custom-link"
    ) as HTMLLinkElement;
    customLink.href = `/themes/custom-${newTheme}.css`;
  };

  return (
    <div className="flex flex-column min-h-screen surface-0">
      <link id="theme-link" rel="stylesheet" href="/themes/light.css" />
      <link id="custom-link" rel="stylesheet" href="/themes/custom-light.css" />
      <div className="shadow z-3" style={{ borderRadius: "0 0 24px 24px" }}>
        <TopNav />
      </div>
      <div
        className="overflow-auto overflow-x-hidden surface-0"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
