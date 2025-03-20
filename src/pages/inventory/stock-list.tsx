// src/pages/inventory/StockList."

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface StockItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  valuation: number;
}

const stockItems: StockItem[] = [
  { id: 1, name: "Laptop", sku: "SKU001", quantity: 50, valuation: 50000 },
  {
    id: 2,
    name: "Office Chair",
    sku: "SKU002",
    quantity: 120,
    valuation: 24000,
  },
  { id: 3, name: "T-Shirt", sku: "SKU003", quantity: 200, valuation: 10000 },
  { id: 4, name: "Headphones", sku: "SKU004", quantity: 80, valuation: 16000 },
  { id: 5, name: "Desk", sku: "SKU005", quantity: 60, valuation: 30000 },
  { id: 6, name: "Mouse", sku: "SKU006", quantity: 150, valuation: 7500 },
];

const StockList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "details">("add");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const openSidebar = (mode: "add" | "edit" | "details", stock?: StockItem) => {
    setFormMode(mode);
    setSelectedStock(stock || null);
    setVisible(true);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Add Stock"
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
            placeholder="Search Stocks"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>

      <DataTable
        value={stockItems}
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="Item Name" sortable></Column>
        <Column field="sku" header="SKU" sortable></Column>
        <Column field="quantity" header="Quantity" sortable></Column>
        <Column field="valuation" header="Valuation ($)" sortable></Column>
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
        {formMode === "add" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Add Stock Item</h3>
            <StockForm />
          </div>
        )}
        {formMode === "edit" && selectedStock && (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit Stock Item</h3>
            <StockForm stock={selectedStock} />
          </div>
        )}
        {formMode === "details" && selectedStock && (
          <div>
            <h3 className="text-xl font-bold mb-4">Stock Item Details</h3>
            <StockDetails stock={selectedStock} />
          </div>
        )}
      </Sidebar>
    </div>
  );
};

interface StockFormProps {
  stock?: StockItem;
}

const StockForm: React.FC<StockFormProps> = ({ stock }) => {
  return (
    <form className="p-fluid">
      <div className="field mb-3">
        <label htmlFor="name">Item Name</label>
        <InputText
          id="name"
          defaultValue={stock?.name || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="sku">SKU</label>
        <InputText
          id="sku"
          defaultValue={stock?.sku || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="quantity">Quantity</label>
        <InputText
          id="quantity"
          type="number"
          defaultValue={stock?.quantity || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="valuation">Valuation ($)</label>
        <InputText
          id="valuation"
          type="number"
          defaultValue={stock?.valuation || ""}
          className="p-inputtext-sm"
        />
      </div>
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-primary p-button-sm"
      />
    </form>
  );
};

interface StockDetailsProps {
  stock: StockItem;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  return (
    <div className="p-fluid">
      <div className="field mb-3">
        <label className="font-bold">Item Name:</label>
        <p>{stock.name}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">SKU:</label>
        <p>{stock.sku}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Quantity:</label>
        <p>{stock.quantity}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Valuation ($):</label>
        <p>${stock.valuation}</p>
      </div>
    </div>
  );
};

export default StockList;
