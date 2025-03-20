import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeflex/primeflex.css";

interface AuditLog {
  id: number;
  action: string;
  user: string;
  date: string;
}

const auditLogs: AuditLog[] = [
  { id: 1, action: "Created Journal Entry", user: "Admin", date: "2024-06-01" },
  {
    id: 2,
    action: "Edited Account 'Cash'",
    user: "Manager",
    date: "2024-06-02",
  },
];

const AuditTrail: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Audit Trail</h2>

      <DataTable
        value={auditLogs}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="action" header="Action" sortable></Column>
        <Column field="user" header="User" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
      </DataTable>
    </div>
  );
};

export default AuditTrail;
