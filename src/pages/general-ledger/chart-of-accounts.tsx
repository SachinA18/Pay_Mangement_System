import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import ApiService from "../../services/api.service";
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from "primereact/tag";

interface Account {
  id: string;
  tenantId: string;
  accountType: number;
  code: string;
  name: string;
  description?: string;
  taxType: number;
  isActive: boolean;
  created: string;
}

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("chartofaccounts", false), []);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await apiService.get();
      if (response) {
        setAccounts(response as Account[]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch chart of accounts'
      });
    }
  };

  const openSidebar = (account: Account | null) => {
    setSelectedAccount(account);
    setVisible(true);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  const formatDateTime = (value: string | undefined) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
  };

  const getStatusTag = (isActive: boolean) => (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "info" : "danger"}
      rounded
    />
  );

  const accountActions = (rowData: Account) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-sm"
      onClick={() => openSidebar(rowData)}
      rounded
      raised
    />
  );

  const handleAccountSaved = () => {
    setVisible(false);
    fetchAccounts();
  };

  return (
    <div className="p-3 h-full">
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">Chart of Accounts</div>
        <div className="text-color-secondary">
          Manage your company's chart of accounts structure
        </div>
      </div>
      <Divider className="mb-1" />
      <div className="p-4 pt-6">
        <div className="flex justify-content-between align-items-center mb-4">
          <div className="flex gap-2">
            <Button
              label="Add Account"
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
              onClick={fetchAccounts}
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
              placeholder="Search Accounts"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-inputtext-sm"
            />
          </div>
        </div>

        <DataTable
          value={accounts}
          globalFilter={globalFilter}
          responsiveLayout="scroll"
          paginator
          rows={10}
          className="p-datatable-sm"
        >
          <Column
            field="isActive"
            header="Status"
            body={(rowData) => getStatusTag(rowData.isActive)}
            className="text-600"
          ></Column>
          <Column field="code" header="Code" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column 
            field="accountType" 
            header="Type" 
            sortable
            body={(rowData) => {
              const types = {
                0: 'Asset',
                1: 'Liability',
                2: 'Equity',
                3: 'Revenue',
                4: 'Expense'
              };
              return types[rowData.accountType as keyof typeof types] || '';
            }}
          ></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column 
            field="created" 
            header="Created" 
            sortable
            body={(rowData) => formatDateTime(rowData.created)}
          ></Column>
          <Column
            header="Actions"
            body={accountActions}
            className="text-600"
          ></Column>
        </DataTable>

        <Sidebar
          visible={visible}
          position="right"
          onHide={() => setVisible(false)}
          style={{ width: "40vw" }}
        >
          <AccountForm selectedAccount={selectedAccount} onAccountSaved={handleAccountSaved} />
        </Sidebar>
      </div>
    </div>
  );
};

interface AccountFormProps {
  selectedAccount?: Account | null;
  onAccountSaved: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ selectedAccount, onAccountSaved }) => {
  const [formData, setFormData] = useState<any>({
    id: selectedAccount?.id || "00000000-0000-0000-0000-000000000000",
    code: selectedAccount?.code || "",
    name: selectedAccount?.name || "",
    accountType: selectedAccount?.accountType || 0,
    description: selectedAccount?.description || "",
    taxType: selectedAccount?.taxType || 0,
    isActive: selectedAccount?.isActive ?? true
  });

  const apiService = useMemo(() => new ApiService("chartofaccounts", false), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAccount) {
        await apiService.put(formData);
      } else {
        await apiService.post(formData);
      }
      onAccountSaved();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  const handleDropdownChange = (e: DropdownChangeEvent, field: string) => {
    setFormData({ ...formData, [field]: e.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <h2>{selectedAccount ? "Edit Account" : "Add Account"}</h2>
      <div className="field">
        <label htmlFor="code">Account Code*</label>
        <InputText
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
          maxLength={10}
        />
      </div>
      <div className="field">
        <label htmlFor="name">Name*</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          maxLength={150}
        />
      </div>
      <div className="field">
        <label htmlFor="accountType">Account Type*</label>
        <Dropdown
          id="accountType"
          value={formData.accountType}
          options={[
            { label: 'Asset', value: 0 },
            { label: 'Liability', value: 1 },
            { label: 'Equity', value: 2 },
            { label: 'Revenue', value: 3 },
            { label: 'Expense', value: 4 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'accountType')}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="taxType">Tax Type*</label>
        <Dropdown
          id="taxType"
          value={formData.taxType}
          options={[
            { label: 'None', value: 0 },
            { label: 'Input', value: 1 },
            { label: 'Output', value: 2 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'taxType')}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          maxLength={500}
        />
      </div>
      <Button type="submit" label={selectedAccount ? "Update" : "Create"} className="mt-4" />
    </form>
  );
};

export default ChartOfAccounts;
