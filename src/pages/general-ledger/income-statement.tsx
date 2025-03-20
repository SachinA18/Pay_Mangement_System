import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeflex/primeflex.css";

interface IncomeStatementItem {
  id: number;
  description: string;
  revenue: number;
  expense: number;
}

const incomeStatementData: IncomeStatementItem[] = [
  { id: 1, description: "Service Revenue", revenue: 15000, expense: 0 },
  { id: 2, description: "Office Supplies", revenue: 0, expense: 500 },
  { id: 3, description: "Utilities", revenue: 0, expense: 300 },
];

const IncomeStatement: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Income Statement</h2>

      <DataTable
        value={incomeStatementData}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="description" header="Description" sortable></Column>
        <Column field="revenue" header="Revenue ($)" sortable></Column>
        <Column field="expense" header="Expense ($)" sortable></Column>
      </DataTable>
    </div>
  );
};

export default IncomeStatement;
