// src/pages/general-ledger/TrialBalance."

import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeflex/primeflex.css";

interface TrialBalance {
  id: number;
  accountName: string;
  debit: number;
  credit: number;
}

const trialBalanceData: TrialBalance[] = [
  { id: 1, accountName: "Cash", debit: 10000, credit: 0 },
  { id: 2, accountName: "Accounts Receivable", debit: 5000, credit: 0 },
  { id: 3, accountName: "Accounts Payable", debit: 0, credit: 3000 },
  { id: 4, accountName: "Revenue", debit: 0, credit: 20000 },
];

const TrialBalance: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trial Balance</h2>

      <DataTable
        value={trialBalanceData}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="accountName" header="Account Name" sortable></Column>
        <Column field="debit" header="Debit ($)" sortable></Column>
        <Column field="credit" header="Credit ($)" sortable></Column>
      </DataTable>
    </div>
  );
};

export default TrialBalance;
