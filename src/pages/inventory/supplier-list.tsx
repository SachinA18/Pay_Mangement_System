// src/pages/inventory/SupplierList."

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Supplier A",
    contact: "John Doe",
    email: "john@suppliera.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Supplier B",
    contact: "Jane Smith",
    email: "jane@supplierb.com",
    phone: "987-654-3210",
  },
  {
    id: 3,
    name: "Supplier C",
    contact: "Mike Johnson",
    email: "mike@supplierc.com",
    phone: "456-789-0123",
  },
  {
    id: 4,
    name: "Supplier D",
    contact: "Sarah Lee",
    email: "sarah@supplierd.com",
    phone: "321-654-9870",
  },
  {
    id: 5,
    name: "Supplier E",
    contact: "Tom Hanks",
    email: "tom@suppliere.com",
    phone: "654-987-1230",
  },
  {
    id: 6,
    name: "Supplier F",
    contact: "Emma Stone",
    email: "emma@supplierf.com",
    phone: "789-123-4560",
  },
];

const SupplierList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [formMode, setFormMode] = useState<"add" | "edit" | "details">("add");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const openSidebar = (
    mode: "add" | "edit" | "details",
    supplier?: Supplier
  ) => {
    setFormMode(mode);
    setSelectedSupplier(supplier || null);
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
            label="Add Supplier"
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
            placeholder="Search Suppliers"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>

      <DataTable
        value={suppliers}
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={20}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="contact" header="Contact Person" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="phone" header="Phone" sortable></Column>
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
            <h3 className="text-xl font-bold mb-4">Add Supplier</h3>
            <SupplierForm />
          </div>
        )}
        {formMode === "edit" && selectedSupplier && (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit Supplier</h3>
            <SupplierForm supplier={selectedSupplier} />
          </div>
        )}
        {formMode === "details" && selectedSupplier && (
          <div>
            <h3 className="text-xl font-bold mb-4">Supplier Details</h3>
            <SupplierDetails supplier={selectedSupplier} />
          </div>
        )}
      </Sidebar>
    </div>
  );
};

interface SupplierFormProps {
  supplier?: Supplier;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier }) => {
  return (
    <form className="p-fluid">
      <div className="field mb-3">
        <label htmlFor="name">Supplier Name</label>
        <InputText
          id="name"
          defaultValue={supplier?.name || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="contact">Contact Person</label>
        <InputText
          id="contact"
          defaultValue={supplier?.contact || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          defaultValue={supplier?.email || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="phone">Phone</label>
        <InputText
          id="phone"
          defaultValue={supplier?.phone || ""}
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

interface SupplierDetailsProps {
  supplier: Supplier;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  return (
    <div className="p-fluid">
      <div className="field mb-3">
        <label className="font-bold">Supplier Name:</label>
        <p>{supplier.name}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Contact Person:</label>
        <p>{supplier.contact}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Email:</label>
        <p>{supplier.email}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Phone:</label>
        <p>{supplier.phone}</p>
      </div>
    </div>
  );
};

export default SupplierList;
