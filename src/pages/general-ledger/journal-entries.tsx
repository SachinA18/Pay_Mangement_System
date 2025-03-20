// src/pages/general-ledger/JournalEntries."

import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";

import JournalEntryForm from "./journal-entry-form";

interface JournalEntry {
  id: number;
  date: Date;
  createdAt: string;
  reference: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  remarks: string;
}

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    date: new Date("2024-06-01"),
    createdAt: "2024-06-01 10:15 AM",
    reference: "JE-1001",
    description: "Office Supplies Purchase",
    amount: 500,
    type: "debit",
    remarks: "Purchased stationery items",
  },
  {
    id: 2,
    date: new Date("2024-06-02"),
    createdAt: "2024-06-02 02:30 PM",
    reference: "JE-1002",
    description: "Service Revenue",
    amount: 1500,
    type: "credit",
    remarks: "Received payment for consulting services",
  },
  {
    id: 3,
    date: new Date("2024-06-03"),
    createdAt: "2024-06-03 11:45 AM",
    reference: "JE-1003",
    description: "Rent Payment",
    amount: 2000,
    type: "debit",
    remarks: "Paid office rent for June",
  },
  {
    id: 4,
    date: new Date("2024-06-04"),
    createdAt: "2024-06-04 04:00 PM",
    reference: "JE-1004",
    description: "Loan Repayment",
    amount: 1000,
    type: "credit",
    remarks: "Partial repayment of business loan",
  },
];

const JournalEntries: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "details">("add");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const openSidebar = (
    mode: "add" | "edit" | "details",
    entry?: JournalEntry
  ) => {
    setFormMode(mode);
    setSelectedEntry(entry || null);
    setVisible(true);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  const formatAmount = (amount: number, type: "debit" | "credit") => {
    return (
      <span
        className={
          type === "debit"
            ? "text-red-500 font-bold"
            : "text-green-500 font-bold"
        }
      >
        ${amount.toLocaleString()}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 mt-2">Journal Entries</h2>
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Add Entry"
            icon="pi pi-plus"
            className="p-button-text p-button-primary p-button-sm"
            onClick={() => openSidebar("add")}
          />
          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-text p-button-primary p-button-sm"
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-text p-button-primary p-button-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            label="Clear"
            icon="pi pi-times"
            className="p-button-text p-button-primary p-button-sm"
            onClick={clearSearch}
          />
          <InputText
            placeholder="Search Entries"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>

      <DataTable
        value={journalEntries}
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="date"
          header="Date"
          sortable
          body={(rowData) => rowData.date.toLocaleDateString()}
        ></Column>
        <Column field="createdAt" header="Created At" sortable></Column>
        <Column field="reference" header="Reference" sortable></Column>
        <Column field="description" header="Description" sortable></Column>
        <Column
          header="Amount"
          body={(rowData) => formatAmount(rowData.amount, rowData.type)}
          sortable
        ></Column>
        <Column field="remarks" header="Remarks" sortable></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-primary p-button-sm"
                onClick={() => openSidebar("edit", rowData)}
              />
              <Button
                icon="pi pi-eye"
                className="p-button-text p-button-primary p-button-sm"
                onClick={() => openSidebar("details", rowData)}
              />
            </div>
          )}
        ></Column>
      </DataTable>

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        className="w-30rem"
      >
        {formMode === "add" && <JournalEntryForm />}
        {formMode === "edit" && selectedEntry && (
          <JournalEntryForm entry={selectedEntry} />
        )}
        {formMode === "details" && selectedEntry && (
          <JournalEntryDetails entry={selectedEntry} />
        )}
      </Sidebar>
    </div>
  );
};

interface JournalEntryDetailsProps {
  entry: JournalEntry;
}

const JournalEntryDetails: React.FC<JournalEntryDetailsProps> = ({ entry }) => {
  const formatAmount = (amount: number, type: "debit" | "credit") => {
    return (
      <span
        className={
          type === "debit"
            ? "text-red-500 font-bold"
            : "text-green-500 font-bold"
        }
      >
        ${amount.toLocaleString()}
      </span>
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Journal Entry Details</h3>

      <div className="grid">
        <div className="col-12 md:col-6 mb-3">
          <strong className="block mb-1">Reference:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {entry.reference}
          </span>
        </div>

        <div className="col-12 md:col-6 mb-3">
          <strong className="block mb-1">Date:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {entry.date.toLocaleDateString()}
          </span>
        </div>

        <div className="col-12 md:col-6 mb-3">
          <strong className="block mb-1">Created At:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {entry.createdAt}
          </span>
        </div>

        <div className="col-12 md:col-6 mb-3">
          <strong className="block mb-1">Type:</strong>
          <span
            className={`block p-2 border-round ${
              entry.type === "debit"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {entry.type === "debit" ? "Debit" : "Credit"}
          </span>
        </div>

        <div className="col-12 md:col-6 mb-3">
          <strong className="block mb-1">Amount:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {formatAmount(entry.amount, entry.type)}
          </span>
        </div>

        <div className="col-12 mb-3">
          <strong className="block mb-1">Description:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {entry.description}
          </span>
        </div>

        <div className="col-12 mb-3">
          <strong className="block mb-1">Remarks:</strong>
          <span className="block p-2 border-round bg-gray-100">
            {entry.remarks}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JournalEntries;
