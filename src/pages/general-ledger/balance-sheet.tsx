// src/pages/general-ledger/BalanceSheet."

import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface BalanceSheetItem {
  id: number;
  accountName: string;
  amount: number;
  category: "Asset" | "Liability" | "Equity";
}

// Sample Data
const balanceSheetData: BalanceSheetItem[] = [
  // Assets
  { id: 1, accountName: "Cash", amount: 15000, category: "Asset" },
  {
    id: 2,
    accountName: "Accounts Receivable",
    amount: 10000,
    category: "Asset",
  },
  { id: 3, accountName: "Inventory", amount: 20000, category: "Asset" },
  { id: 4, accountName: "Equipment", amount: 50000, category: "Asset" },

  // Liabilities
  {
    id: 5,
    accountName: "Accounts Payable",
    amount: 12000,
    category: "Liability",
  },
  { id: 6, accountName: "Loan Payable", amount: 30000, category: "Liability" },

  // Equity
  { id: 7, accountName: "Owner's Capital", amount: 43000, category: "Equity" },
  {
    id: 8,
    accountName: "Retained Earnings",
    amount: 10000,
    category: "Equity",
  },
];

const BalanceSheet: React.FC = () => {
  // Group data by category
  const assets = balanceSheetData.filter((item) => item.category === "Asset");
  const liabilities = balanceSheetData.filter(
    (item) => item.category === "Liability"
  );
  const equity = balanceSheetData.filter((item) => item.category === "Equity");

  // Calculate totals
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);

  // Combine all items for a single DataTable
  const combinedData = [
    {
      id: "header-assets",
      accountName: "Assets",
      amount: null,
      category: "Header",
    },
    ...assets,
    {
      id: "total-assets",
      accountName: "Total Assets",
      amount: totalAssets,
      category: "Total",
    },

    {
      id: "header-liabilities",
      accountName: "Liabilities",
      amount: null,
      category: "Header",
    },
    ...liabilities,
    {
      id: "total-liabilities",
      accountName: "Total Liabilities",
      amount: totalLiabilities,
      category: "Total",
    },

    {
      id: "header-equity",
      accountName: "Equity",
      amount: null,
      category: "Header",
    },
    ...equity,
    {
      id: "total-equity",
      accountName: "Total Equity",
      amount: totalEquity,
      category: "Total",
    },
  ];

  // Custom row class for styling headers and totals
  const rowClassName = (rowData: any) => {
    if (rowData.category === "Header") return "font-bold bg-primary-100";
    if (rowData.category === "Total") return "font-bold bg-primary-50";
    return "";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 mt-2">Balance Sheet</h2>

      <Card className="shadow-2">
        <DataTable
          value={combinedData}
          className="p-datatable-sm text-sm"
          rowClassName={rowClassName}
        >
          <Column field="accountName" header="Account Name" />
          <Column
            field="amount"
            header="Amount ($)"
            body={(rowData) =>
              rowData.amount !== null ? rowData.amount.toLocaleString() : ""
            }
            style={{ textAlign: "right" }}
          />
        </DataTable>
      </Card>

      {/* Overall Totals */}
      <div className="flex justify-content-end mt-4">
        <Card className="w-30rem shadow-3">
          <h3 className="text-xl font-bold mb-2">Overall Balance</h3>
          <div className="flex justify-content-between text-lg">
            <span>Total Assets:</span>
            <span>${totalAssets.toLocaleString()}</span>
          </div>
          <div className="flex justify-content-between text-lg mt-2">
            <span>Total Liabilities + Equity:</span>
            <span>${(totalLiabilities + totalEquity).toLocaleString()}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BalanceSheet;
