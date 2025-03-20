import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Menu } from "primereact/menu";
import { Divider } from "primereact/divider";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      items: [
        {
          label: "Company",
          icon: "pi pi-building",
          command: () => navigate("/settings/company"),
        },
        {
          label: "Currencies",
          icon: "pi pi-dollar",
          command: () => navigate("/settings/currencies"),
        },
        {
          label: "Default",
          icon: "pi pi-cog",
          command: () => navigate("/settings/default"),
        },
        {
          label: "Email Templates",
          icon: "pi pi-envelope",
          command: () => navigate("/settings/email-template"),
        },
        {
          label: "Invoices",
          icon: "pi pi-file",
          command: () => navigate("/settings/invoices"),
        },
        {
          label: "Localization",
          icon: "pi pi-globe",
          command: () => navigate("/settings/localization"),
        },
        {
          label: "Scheduling",
          icon: "pi pi-calendar",
          command: () => navigate("/settings/scheduling"),
        },
        {
          label: "Taxes",
          icon: "pi pi-percentage",
          command: () => navigate("/settings/taxes"),
        },
      ],
    },
  ];

  return (
    <div className="p-3 h-full surface-0">
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">Settings</div>
        <div className="text-color-secondary">
          Configure and manage all essential settings for your company
          operations.
        </div>
      </div>
      <Divider className="mb-1" />
      <div className="flex">
        <Menu model={menuItems} className="surface-0 w-20rem border-0" />
        <div className="flex-1 p-5 mt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
