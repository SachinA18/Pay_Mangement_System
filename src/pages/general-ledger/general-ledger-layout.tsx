import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "General Ledger",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-home",
          command: () => navigate("/general-ledger/dashboard"),
        },
        {
          label: "Chart of Accounts",
          icon: "pi pi-list",
          command: () => navigate("/general-ledger/chart-of-accounts"),
        },
        {
          label: "Journal Entries",
          icon: "pi pi-book",
          command: () => navigate("/general-ledger/journal-entries"),
        },
        {
          label: "Trial Balance",
          icon: "pi pi-table",
          command: () => navigate("/general-ledger/trial-balance"),
        },
        {
          label: "Balance Sheet",
          icon: "pi pi-chart-line",
          command: () => navigate("/general-ledger/balance-sheet"),
        },
        {
          label: "Income Statement",
          icon: "pi pi-file",
          command: () => navigate("/general-ledger/income-statement"),
        },
        {
          label: "Audit Trail",
          icon: "pi pi-history",
          command: () => navigate("/general-ledger/audit-trail"),
        },
      ],
    },
  ];

  return (
    <div className="flex h-full">
      <Menu model={menuItems} className="h-full w-12rem bg-gray-100" />
      <div className="flex flex-column flex-grow-1">
        <main className="p-3 px-4 overflow-auto flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
