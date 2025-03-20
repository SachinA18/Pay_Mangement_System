import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";

import { Divider } from "primereact/divider";

import Contact from "./contact";
import ApiService from "../../services/api.service";
import { Tag } from "primereact/tag";

const Contacts = () => {
  const [contacts, setContacts]: any[] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const apiService = useMemo(() => new ApiService("Contacts"), []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const fetchCustomers = async () => {
    const response: any = await apiService.get();
    console.log(response);
    if (Array.isArray(response)) {
      setContacts(response);
    }
  };

  const handleContactSaved = (savedContact: any) => {
    setVisible(false);
    fetchCustomers();
  };

  const clearSearch = useCallback(() => {
    setGlobalFilter("");
  }, []);

  const openSidebar = (contact: any) => {
    setSelected(contact);
    setVisible(true);
  };

  const getStatusTag = (isActive: any) => (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "info" : "danger"}
      rounded
    />
  );

  const formatDateTime = (value: string) => {
    if (!value) return "";
    const dateObj = new Date(value);
    return dateObj.toLocaleString();
  };

  return (
    <div className="p-3 h-full">
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">Contacts</div>
        <div className="text-color-secondary">
          Configure and manage all essential settings for your company
          operations.
        </div>
      </div>
      <Divider className="mb-1" />
      <div className="p-4 pt-6">
        <div className="flex justify-content-between align-items-center mb-4">
          <div className="flex gap-2">
            <Button
              label="Add contact"
              icon="pi pi-plus"
              className="p-button-primary p-button-sm"
              onClick={() => openSidebar(null)}
            />
            <Button
              label="Export"
              icon="pi pi-download"
              className="p-button-text p-button-sm p-1 ml-3"
            />
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              className="p-button-text p-button-sm p-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Clear"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
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
          value={contacts}
          globalFilter={globalFilter}
          className="p-datatable-sm"
        >
          <Column
            field="isActive"
            header="Status"
            body={(rowData) => getStatusTag(rowData.isActive)}
            className="text-600"
          ></Column>
          <Column field="contactName" header="Name" sortable></Column>
          <Column field="contactName" header="Customer" sortable></Column>
          <Column field="contactName" header="Supplier" sortable></Column>
          <Column
            field="accountNumber"
            header="Account Number"
            sortable
          ></Column>
          <Column
            field="businessInfoWebsite"
            header="Website"
            sortable
          ></Column>
          <Column
            field="businessInfoBusinessRegNumber"
            header="Business Registration"
            sortable
          ></Column>
          <Column
            field="created"
            header="Created"
            sortable
            body={(rowData) => formatDateTime(rowData.created)}
            className="text-600"
          ></Column>
          <Column
            header="Actions"
            body={(contact) => (
              <Button
                icon="pi pi-pencil"
                className="p-button-sm"
                onClick={() => openSidebar(contact)}
                rounded
                raised
              />
            )}
          ></Column>
        </DataTable>
        <Sidebar
          visible={visible}
          position="right"
          onHide={handleCancel}
          style={{ width: "40vw" }}
        >
          <Contact
            selectedContact={selected}
            onContactSaved={handleContactSaved}
          ></Contact>
        </Sidebar>
      </div>
    </div>
  );
};

export default Contacts;
