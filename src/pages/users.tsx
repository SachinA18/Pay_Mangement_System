import React, { useState, useEffect, useMemo, useRef } from "react";
import { FormEvent } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api.service";
import { Toast } from "primereact/toast";

interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  reference?: string;
  abn?: string;
  currency?: string;
  address?: string;
  town?: string;
  zip?: string;
  province?: string;
  country?: string;
}

const mockData: User[] = [
  {
    id: "1",
    name: "Adam",
    email: "adam@gmail.com",
    phone: "123456789",
    website: "adam.lk",
    reference: "ref1",
    abn: "1",
    currency: "AUD",
    address: "address1",
    town: "town1",
    zip: "10000",
    province: "pro1",
    country: "Australia",
  },
  {
    id: "2",
    name: "Thomas",
    email: "thomas@gmail.com",
    phone: "987654321",
    website: "thomas.lk",
    reference: "ref2",
    abn: "2",
    currency: "AUD",
    address: "address2",
    town: "town2",
    zip: "20000",
    province: "pro2",
    country: "Australia",
  },
];

const currencies = [
  { label: "Australian Dollar", value: "AUD" },
  { label: "US Dollar", value: "USD" },
  { label: "Euro", value: "EUR" },
];

const countries = [
  { label: "Australia", value: "Australia" },
  { label: "USA", value: "USA" },
  { label: "India", value: "India" },
];

const UserManagement: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "details">("add");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [users, setUsers] = useState<User[]>(mockData);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const apiService = useMemo(() => new ApiService("ItemSettings"), []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await apiService.get();
    if (Array.isArray(response)) {
      setUsers(response);
    }
  };

  const openSidebar = (mode: "add" | "edit" | "details", user?: User) => {
    setFormMode(mode);
    setSelectedUser(user || null);
    setFormData(user || {});
    setVisible(true);
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  const handleDelete = async (user: User) => {
    try {
      // API call would go here
      // await apiService.delete(user.id);

      toast.current?.show({
        severity: "success",
        summary: "User Deleted",
        detail: "User has been successfully deleted",
        life: 3000,
      });
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete user. Please try again.",
        life: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.name || !formData.email || !formData.currency) {
        toast.current?.show({
          severity: "warn",
          summary: "Validation Error",
          detail: "Please fill in all required fields",
          life: 3000,
        });
        return;
      }

      let response: { id?: string; message?: string };
      if (formData.id) {
        response = (await apiService.put(formData)) as {
          id?: string;
          message?: string;
        };
      } else {
        response = (await apiService.post(formData)) as {
          id?: string;
          message?: string;
        };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: "success",
          summary: formMode === "add" ? "User Created" : "User Updated",
          detail:
            formMode === "add"
              ? "New user has been successfully created"
              : "User has been successfully updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Failed to save user. Please try again.",
          life: 3000,
        });
      }
      setVisible(false);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.message || "An unexpected error occurred. Please try again.",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2>User Management</h2>
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Add Users"
            icon="pi pi-plus"
            className="p-button-sm"
            text
            onClick={() => navigate("/user-profile")}
          />
          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-sm"
            text
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-sm"
            text
          />
        </div>
        <div className="flex gap-2">
          <Button
            label="Clear"
            icon="pi pi-times"
            className="p-button-sm"
            onClick={clearSearch}
            text
          />
          <InputText
            placeholder="Search Users"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>

      <DataTable
        value={users}
        globalFilter={globalFilter}
        className="p-datatable-sm text-sm"
        paginator
        rows={5}
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="phone" header="Phone" sortable></Column>
        <Column field="website" header="Website" sortable></Column>
        <Column field="reference" header="Reference" sortable></Column>
        <Column field="abn" header="ABN Number" sortable></Column>
        <Column field="currency" header="Currency" sortable></Column>
        <Column field="address" header="Address" sortable></Column>
        <Column field="town" header="Town" sortable></Column>
        <Column field="zip" header="Postal / Zip Code" sortable></Column>
        <Column field="province" header="Province" sortable></Column>
        <Column field="country" header="Country" sortable></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-sm"
                onClick={() => openSidebar("edit", rowData)}
                text
              />
              <Button
                icon="pi pi-eye"
                className="p-button-sm"
                onClick={() => openSidebar("details", rowData)}
                text
              />
              <Button
                icon="pi pi-trash"
                className="p-button-sm"
                onClick={() => handleDelete(rowData)}
                text
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
            <h3 className="text-xl font-bold mb-4">Add User</h3>
            <UserForm formData={formData} onChange={handleInputChange} />
          </div>
        )}
        {formMode === "edit" && selectedUser && (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <UserForm formData={formData} onChange={handleInputChange} />
          </div>
        )}
        {formMode === "details" && selectedUser && (
          <div>
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            <UserDetails user={selectedUser} />
          </div>
        )}
      </Sidebar>
    </div>
  );
};

interface UserFormProps {
  formData: Partial<User>;
  onChange: (field: keyof User, value: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ formData, onChange }) => {
  const toast = useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("users"), []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/u.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please check the form for errors and try again.",
        life: 3000,
      });
      return;
    }

    try {
      let response: { id?: string; message?: string };
      if (formData.id) {
        response = (await apiService.put(formData)) as {
          id?: string;
          message?: string;
        };
      } else {
        response = (await apiService.post(formData)) as {
          id?: string;
          message?: string;
        };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: `User ${formData.id ? "updated" : "created"} successfully.`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Failed to save user. Please try again.",
          life: 3000,
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.message || "An unexpected error occurred. Please try again.",
        life: 3000,
      });
    }
  };

  return (
    <form className="p-fluid" onSubmit={handleSubmit}>
      <Toast ref={toast} />
      <div className="field">
        <label htmlFor="name">Name *</label>
        <InputText
          id="name"
          value={formData.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter Name"
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email *</label>
        <InputText
          id="email"
          value={formData.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Enter Email"
        />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <InputText
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Enter Phone"
        />
      </div>
      <div className="field">
        <label htmlFor="website">Website</label>
        <InputText
          id="website"
          value={formData.website || ""}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="Enter Website"
        />
      </div>
      <div className="field">
        <label htmlFor="reference">Reference</label>
        <InputText
          id="reference"
          value={formData.reference || ""}
          onChange={(e) => onChange("reference", e.target.value)}
          placeholder="Enter Reference"
        />
      </div>
      <div className="field">
        <label htmlFor="abn">ABN Number</label>
        <InputText
          id="abn"
          value={formData.abn || ""}
          onChange={(e) => onChange("abn", e.target.value)}
          placeholder="Enter ABN Number"
        />
      </div>
      <div className="field">
        <label htmlFor="currency">Currency *</label>
        <Dropdown
          id="currency"
          value={formData.currency || ""}
          onChange={(e) => onChange("currency", e.value)}
          options={currencies}
          placeholder="Select Currency"
        />
      </div>
      <div className="field">
        <label htmlFor="address">Address</label>
        <InputText
          id="address"
          value={formData.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Enter Address"
        />
      </div>
      <div className="field">
        <label htmlFor="town">Town / City</label>
        <InputText
          id="town"
          value={formData.town || ""}
          onChange={(e) => onChange("town", e.target.value)}
          placeholder="Enter Town/City"
        />
      </div>
      <div className="field">
        <label htmlFor="zip">Postal / Zip Code</label>
        <InputText
          id="zip"
          value={formData.zip || ""}
          onChange={(e) => onChange("zip", e.target.value)}
          placeholder="Enter Postal/Zip Code"
        />
      </div>
      <div className="field">
        <label htmlFor="province">Province / State</label>
        <InputText
          id="province"
          value={formData.province || ""}
          onChange={(e) => onChange("province", e.target.value)}
          placeholder="Enter Province"
        />
      </div>
      <div className="field">
        <label htmlFor="country">Country *</label>
        <Dropdown
          id="country"
          value={formData.country || ""}
          onChange={(e) => onChange("country", e.value)}
          options={countries}
          placeholder="Select Country"
        />
      </div>
      <div className="field flex justify-content-end gap-2 mt-4">
        <Button label="Save" type="submit" className="p-button-primary" />
        <Button label="Cancel" type="button" className="p-button-text" />
      </div>
    </form>
  );
};

interface UserDetailsProps {
  user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="p-fluid">
      <div className="field">
        <label className="font-bold">Name:</label>
        <p>{user.name}</p>
      </div>
      <div className="field">
        <label className="font-bold">Email:</label>
        <p>{user.email}</p>
      </div>
      <div className="field">
        <label className="font-bold">Phone:</label>
        <p>{user.phone}</p>
      </div>
      <div className="field">
        <label className="font-bold">Website:</label>
        <p>{user.website}</p>
      </div>
      <div className="field">
        <label className="font-bold">Reference:</label>
        <p>{user.reference}</p>
      </div>
      <div className="field">
        <label className="font-bold">ABN Number:</label>
        <p>{user.abn}</p>
      </div>
      <div className="field">
        <label className="font-bold">Currency:</label>
        <p>{user.currency}</p>
      </div>
      <div className="field">
        <label className="font-bold">Address:</label>
        <p>{user.address}</p>
      </div>
      <div className="field">
        <label className="font-bold">Town:</label>
        <p>{user.town}</p>
      </div>
      <div className="field">
        <label className="font-bold">Postal / Zip Code:</label>
        <p>{user.zip}</p>
      </div>
      <div className="field">
        <label className="font-bold">Province:</label>
        <p>{user.province}</p>
      </div>
      <div className="field">
        <label className="font-bold">Country:</label>
        <p>{user.country}</p>
      </div>
    </div>
  );
};

export default UserManagement;
