import React from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";

interface JournalEntry {
  id: number;
  date: string;
  reference: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
}

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    date: "2024-06-01",
    reference: "JE-1001",
    description: "Office Supplies Purchase",
    amount: 500,
    type: "debit",
  },
  {
    id: 2,
    date: "2024-06-02",
    reference: "JE-1002",
    description: "Service Revenue",
    amount: 1500,
    type: "credit",
  },
  {
    id: 3,
    date: "2024-06-03",
    reference: "JE-1003",
    description: "Rent Payment",
    amount: 2000,
    type: "debit",
  },
  {
    id: 4,
    date: "2024-06-04",
    reference: "JE-1004",
    description: "Loan Repayment",
    amount: 1000,
    type: "credit",
  },
  {
    id: 5,
    date: "2024-06-05",
    reference: "JE-1005",
    description: "Equipment Purchase",
    amount: 3000,
    type: "debit",
  },
];

const totalDebits = journalEntries
  .filter((entry) => entry.type === "debit")
  .reduce((sum, entry) => sum + entry.amount, 0);

const totalCredits = journalEntries
  .filter((entry) => entry.type === "credit")
  .reduce((sum, entry) => sum + entry.amount, 0);

const totalEntries = journalEntries.length;

const chartData = {
  labels: ["Debits", "Credits"],
  datasets: [
    {
      data: [totalDebits, totalCredits],
      backgroundColor: ["#FF6B6B", "#4CAF50"],
      hoverBackgroundColor: ["#FF4F4F", "#45A049"],
    },
  ],
};

const barChartData = {
  labels: journalEntries.map((entry) => entry.reference),
  datasets: [
    {
      label: "Amount",
      backgroundColor: journalEntries.map((entry) =>
        entry.type === "debit" ? "#FF6B6B" : "#4CAF50"
      ),
      data: journalEntries.map((entry) => entry.amount),
    },
  ],
};

const JournalEntriesDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 mt-2">
        Journal Entries Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid mb-4">
        <div className="col-12 md:col-4">
          <Card className="shadow-2 p-3">
            <h3 className="text-md font-bold mb-2">Total Debits</h3>
            <p className="text-2xl text-red-500 font-bold">
              ${totalDebits.toLocaleString()}
            </p>
          </Card>
        </div>
        <div className="col-12 md:col-4">
          <Card className="shadow-2 p-3">
            <h3 className="text-md font-bold mb-2">Total Credits</h3>
            <p className="text-2xl text-green-500 font-bold">
              ${totalCredits.toLocaleString()}
            </p>
          </Card>
        </div>
        <div className="col-12 md:col-4">
          <Card className="shadow-2 p-3">
            <h3 className="text-md font-bold mb-2">Total Entries</h3>
            <p className="text-2xl text-blue-500 font-bold">{totalEntries}</p>
          </Card>
        </div>
      </div>

      <div className="mb-4 mt-6">
        <h3 className="text-md font-bold mb-2">Recent Transactions</h3>
        <DataTable value={journalEntries} className="p-datatable-sm text-sm">
          <Column field="id" header="ID"></Column>
          <Column field="date" header="Date"></Column>
          <Column field="reference" header="Reference"></Column>
          <Column field="description" header="Description"></Column>
          <Column
            field="amount"
            header="Amount"
            body={(rowData) => (
              <span
                className={
                  rowData.type === "debit"
                    ? "text-red-500 font-bold"
                    : "text-green-500 font-bold"
                }
              >
                ${rowData.amount.toLocaleString()}
              </span>
            )}
          ></Column>
        </DataTable>
      </div>

      <div className="grid mt-6">
        <div className="col-12 md:col-6 mb-4">
          <Card
            className="shadow-2 p-3"
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 className="text-md font-bold mb-3">Debits vs Credits</h3>
            <Chart
              type="pie"
              data={chartData}
              style={{ width: "250px", height: "250px" }}
              options={{
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </Card>
        </div>
        <div className="col-12 md:col-6 mb-4">
          <Card
            className="shadow-2 p-3"
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 className="text-md font-bold mb-3">Transactions Amounts</h3>
            <Chart
              type="bar"
              data={barChartData}
              style={{ height: "250px" }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalEntriesDashboard;
