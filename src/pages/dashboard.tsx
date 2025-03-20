import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ChartDataLabels from "chartjs-plugin-datalabels";

import imgInvoice from "../assets/images/dashboard/invoice.png";
import imgSalary from "../assets/images/dashboard/salary.png";
import { fixedAmount } from "../helpers/template.helper";

const Dashboard: React.FC = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const [kpi] = useState({
    invoices: { value: 8000, text: "+5% increment", color: "green" },
    paymentLinks: { value: "4,000 R K", text: "+8% increment", color: "green" },
    revenue: { value: "$120,000", text: "2% Less", color: "red" },
    cashReceived: { value: "$820,000", text: "+5% increment", color: "green" },
  });

  const periodOptions = [
    { label: "This Month", value: "this-month" },
    { label: "Last Month", value: "last-month" },
    { label: "This Year", value: "this-year" },
  ];

  const cardItems = [
    { title: "Total Invoices", data: kpi.invoices },
    { title: "Total Payment Links", data: kpi.paymentLinks },
    { title: "Total Revenue", data: kpi.revenue },
    { title: "Total Cash Received", data: kpi.cashReceived },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  const incomeOptions = [{ label: "Income", value: "income" }];
  const [selectedIncome] = useState("income");

  const yearOptions = [{ label: "Financial Year 2024", value: "fy2024" }];
  const [selectedYear] = useState("fy2024");

  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "2024",
        data: [100, 60, 40, 50, 70, 60, 80, 90, 70, 75, 85, 65],
        borderColor: "#4e91f9",
        tension: 0,
      },
    ],
  };

  const doughnutData = {
    labels: ["Invoices", "Payment Links", "Cash Flow"],
    datasets: [
      {
        data: [25, 12, 25],
        backgroundColor: ["#7086FD", "#842DFF", "#17C7EA"],
        hoverBackgroundColor: ["#7a55f2", "#842DFF", "#17C7EA"],
      },
    ],
  };

  const recentItems = [
    {
      id: 1,
      type: "invoice",
      message: "Invoice for Samer Khalil was sent by Fadi",
      time: "5 min ago",
      icon: imgInvoice,
    },
    {
      id: 2,
      type: "invoice",
      message: "Invoice for Samer Khalil was sent by Fadi",
      time: "5 min ago",
      icon: imgInvoice,
    },
    {
      id: 3,
      type: "salary",
      message: "Salary Payment",
      time: "5 min ago",
      icon: imgSalary,
    },
    {
      id: 4,
      type: "salary",
      message: "Salary Payment",
      time: "5 min ago",
      icon: imgSalary,
    },
    {
      id: 5,
      type: "invoice",
      message: "Invoice for Samer Khalil was sent by Fadi",
      time: "5 min ago",
      icon: imgInvoice,
    },
  ];

  const invoicesData = [
    {
      invoiceNum: "A*25",
      date: "07-06-2017",
      customer: "Sameer Khal-110106",
      balance: 500.0,
      amount: 200.0,
      status: "Sent",
      user: "Fadi",
    },
    {
      invoiceNum: "A*25",
      date: "07-06-2017",
      customer: "Sameer Khal-110106",
      balance: 500.0,
      amount: 200.0,
      status: "Draft",
      user: "Fadi",
    },
    {
      invoiceNum: "A*25",
      date: "07-06-2017",
      customer: "Sameer Khal-110106",
      balance: 500.0,
      amount: 200.0,
      status: "Review",
      user: "Fadi",
    },
    {
      invoiceNum: "A*25",
      date: "07-06-2017",
      customer: "Sameer Khal-110106",
      balance: 500.0,
      amount: 200.0,
      status: "Canceled",
      user: "Fadi",
    },
    {
      invoiceNum: "A*25",
      date: "07-06-2017",
      customer: "Sameer Khal-110106",
      balance: 500.0,
      amount: 200.0,
      status: "Sent",
      user: "Fadi",
    },
  ];

  const exportCSV = () => {
    toast.current?.show({
      severity: "info",
      summary: "Export CSV",
      detail: "Exporting data to CSV...",
      life: 2000,
    });
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 1,
        tension: 0,
      },
    },
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        color: "#fff",
        anchor: "center",
        align: "center",
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  const handleSeeAll = () => navigate("/invoices");
  const handleNewInvoice = () =>
    navigate("/invoice-form/00000000-0000-0000-0000-000000000000");

  return (
    <div className="p-5">
      <Toast ref={toast} />
      <div className="font-medium text-2xl mb-3">ABC Company - Dashboard</div>
      <div className="grid">
        <div className="lg:col-9 pr-5">
          <div className="flex justify-content-around border-top-1 border-bottom-1 border-300">
            {cardItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-column justify-content-center align-items-center py-4"
              >
                <div className="grid">
                  <div>
                    <div className="text-gray-500 text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="text-2xl font-medium mt-2">
                      {item.data.value}
                    </div>
                    <div
                      className="text-sm font-medium py-1 px-2 mt-2"
                      style={{ color: item.data.color }}
                    >
                      {item.data.text}
                    </div>
                  </div>
                  <div>
                    <hr
                      style={{
                        width: "1px",
                        height: "60px",
                        background: "#BECFEC",
                        border: "none",
                        marginLeft: "20px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-column gap-2 justify-content-center">
              <Dropdown
                value={selectedPeriod}
                options={periodOptions}
                onChange={(e) => setSelectedPeriod(e.value)}
                className="p-dropdown-sm"
                style={{
                  width: "150px",
                }}
              />
              <Button
                label="Export CSV"
                onClick={exportCSV}
                className="px-4 py-2 border-none"
              />
            </div>
          </div>
          <div>
            <div className="grid py-4">
              <div className="lg:col-3">
                <div className="text-xl font-medium mb-4 mt-3">
                  Revenue Trends
                </div>
                <div className="p-fluid">
                  <div>
                    <Dropdown
                      value={selectedIncome}
                      options={incomeOptions}
                      className="p-dropdown-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <Dropdown
                      value={selectedYear}
                      options={yearOptions}
                      className="p-dropdown-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-9">
                <div>
                  <Chart
                    height="200px"
                    type="line"
                    data={lineChartData}
                    options={lineChartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xl font-medium ">Invoices</div>
            <div className="flex justify-content-between align-items-center py-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText placeholder="Search" className="p-inputtext-sm" />
              </IconField>

              <div className="flex gap-3">
                <Button
                  onClick={handleSeeAll}
                  label="See All"
                  severity="secondary"
                  className="p-button-sm"
                />
                <Button
                  onClick={handleNewInvoice}
                  label="New Invoice"
                  className="p-button-sm"
                />
              </div>
            </div>
            <DataTable
              value={invoicesData}
              className="p-datatable-sm"
              emptyMessage="No invoices found"
            >
              <Column field="invoiceNum" header="Invoice #" />
              <Column field="date" header="Date" />
              <Column field="customer" header="Customer" />
              <Column
                field="balance"
                header="Balance"
                className="text-right"
                body={(row) => fixedAmount(row.balance)}
              />
              <Column
                field="amount"
                header="Amount"
                className="text-right"
                body={(row) => fixedAmount(row.amount)}
              />
              <Column field="status" header="Status" />
              <Column field="user" header="User" />
              <Column
                body={() => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-text"
                      tooltip="View"
                    />
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-text"
                      tooltip="Edit"
                    />
                    <Button
                      icon="pi pi-box"
                      className="p-button-rounded p-button-text"
                      tooltip="Edit"
                    />
                    <Button
                      icon="pi pi-ellipsis-h"
                      className="p-button-rounded p-button-text"
                      tooltip="Edit"
                    />
                  </div>
                )}
                style={{ width: "6rem" }}
              />
            </DataTable>
          </div>
        </div>

        <div className="lg:col-3">
          <div>
            <div className="text-xl font-medium mb-3">Income Breakdown</div>
            <Chart
              type="doughnut"
              data={doughnutData}
              options={doughnutOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
          <div className="py-5">
            <div className="text-xl font-medium">Recent Activities</div>
            <Divider className="my-4" />
            <div className="flex flex-column gap-2">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-1 border-300 align-items-center p-2"
                >
                  <img
                    src={item.icon}
                    alt={`${item.type} Icon`}
                    style={{ width: "36px", height: "36px" }}
                  />
                  <div className="ml-2">
                    <div className="text-gray-800 text-sm font-medium mb-2">
                      {item.message}
                    </div>
                    <div className="text-gray-500 text-xs">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
