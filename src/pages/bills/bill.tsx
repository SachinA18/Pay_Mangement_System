import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { TabMenu, TabMenuTabChangeEvent } from "primereact/tabmenu";
import { Toast } from "primereact/toast";

import ApiService from "../../services/api.service";
import { BreadCrumb } from "primereact/breadcrumb";

const defaultColumns = {
  view: false,
  form: false,
  status: false,
  references: false,
  date: false,
  dueDate: false,
  paid: false,
  due: false,
  curruncy: false,
  files: false,
  credited: false,
  paidDate: false,
  Total: false,
};

const Bills = () => {
  const navigate = useNavigate();

  const [bills, setBills] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  const toast = useRef<Toast>(null);

  const apiService = useMemo(() => new ApiService("bill"), []);

  const tabItems = [
    { label: "All" },
    { label: "Drafts" },
    { label: "Sent" },
    { label: "Declined" },
    { label: "Accepted" },
    { label: "Invoiced" },
  ];

  const buttonItems = [
    { label: "New Credit Note", icon: "pi pi-credit-card" },
    { label: "Send Statement", icon: "pi pi-envelope" },
    { label: "Import", icon: "pi pi-upload" },
    { label: "Export", icon: "pi pi-download" },
  ];

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [{ label: "Bills", url: "/bills" }];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onTabChange = (e: TabMenuTabChangeEvent) => {
    setSelectedTab(e.value.label ?? "All");
  };

  const newBill = (): void => {
    navigate("/bill-form/00000000-0000-0000-0000-000000000000");
  };

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    const result: any = await apiService.get();

    if (result.constructor === Array) {
      setBills(result);
    }
  };

  const handleDelete = (bill: any) => {};

  return (
    <div className="flex flex-column h-screen">
      <div className="flex-grow-1 overflow-auto p-5">
        <Toast ref={toast}></Toast>
        <div className="flex justify-content-between align-items-start mb-4">
          <div>
            <BreadCrumb
              model={breadcrumbItems}
              home={breadcrumbHome}
              className="mb-3 text-700 bg-transparent border-none p-0"
            />
            <div className="text-600 text-3xl mt-4 mb-2 font-medium">
              Bills
            </div>
            <div className="text-500">Create, Edit & Manage Bills</div>
          </div>

          <SplitButton
            label="New Bills"
            icon="pi pi-plus"
            onClick={newBill}
            model={buttonItems}
          />
        </div>
        <div className="p-card">
        <TabMenu
          model={tabItems}
          activeIndex={tabItems.findIndex((tab) => tab.label === selectedTab)}
          onTabChange={(e) => onTabChange(e)}
        />

        <div className="mt-4 py-4">
          <div className="flex flex-wrap align-items-center gap-3 mb-4">
            <span className="p-input-icon-left w-20rem">
              <InputText
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Global Search"
                className="w-full"
              />
            </span>
          </div>
          <div className="mt-2 w-full">
            {bills.length > 0 ? (
              <DataTable
                value={bills}
                className="p-datatable-sm text-sm w-full"
                paginator
                rows={50}
              >
                <Column
                  field="billNumber"
                  header="Bill Number"
                  sortable
                  filter
                ></Column>
                <Column field="to" header="Customer" sortable filter></Column>
                <Column
                  field="date"
                  header="Bill Date"
                  sortable
                  filter
                ></Column>
                <Column
                  field="dueDate"
                  header="Due Date"
                  sortable
                  filter
                ></Column>
                <Column
                  field="currency"
                  header="Currency"
                  sortable
                  filter
                ></Column>
                <Column
                  field="amountType"
                  header="Amount Type"
                  sortable
                  filter
                ></Column>
                <Column
                  field="paymentMethod"
                  header="Payment Method"
                  sortable
                  filter
                ></Column>
                <Column field="item" header="Item" sortable filter></Column>
                <Column field="total" header="Total" sortable filter></Column>
                <Column
                  header="Actions"
                  body={(rowData) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-text p-button-primary p-button-sm"
                      />
                      <Button
                        icon="pi pi-eye"
                        className="p-button-text p-button-primary p-button-sm"
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-text p-button-danger p-button-sm"
                        onClick={() => handleDelete(rowData)}
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            ) : (
              <div className="flex flex-column align-items-center mt-4">
                <i className="pi pi-file text-xl"></i>
                <label className="mt-2 mb-4 text-lg">
                  No Bills here yet, create new Bill.
                </label>
                <div>
                  <Button
                    label="New bill"
                    onClick={newBill}
                    className="p-button-primary mr-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Bills;
