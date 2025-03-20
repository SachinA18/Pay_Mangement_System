import React, { useState, useEffect, useMemo } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";

import ApiService from "../../services/api.service";

const defaultTaxData = {
  id: "00000000-0000-0000-0000-000000000000",
  tenantId: localStorage.getItem("tenantId"),
  taxName: "",
  taxType: 1,
  taxRate: 0,
};

const typeOptions = [
  { label: "Normal", value: 1 },
  { label: "Inclusive", value: 2 },
];

const TaxSettings: React.FC = () => {
  const [taxes, setTaxes] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [formData, setFormData] = useState({ ...defaultTaxData });
  const [errors, setErrors] = useState<any>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const apiService = useMemo(() => new ApiService("TaxSettings"), []);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    const response: any = await apiService.get();
    if (Array.isArray(response)) {
      setTaxes(response);
    }
  };

  const openSidebar = (tax: any) => {
    setSelectedTax(tax);
    setFormData(tax ? { ...tax } : { ...defaultTaxData });
    setErrors({});
    setVisible(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rate" ? parseFloat(value) : value,
    }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownChange = (e: any) => {
    setFormData((prev) => ({ ...prev, taxType: e.value }));
    setErrors((prev: any) => ({ ...prev, taxType: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.taxName) newErrors.taxName = "Name is required.";
    if (formData.taxRate === null || isNaN(formData.taxRate))
      newErrors.taxRate = "Rate must be a valid number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response: any = selectedTax
      ? await apiService.put(formData)
      : await apiService.post(formData);

    if (response.id) {
      setTaxes((prev: any) =>
        selectedTax
          ? prev.map((tax: any) => (tax.id === response.id ? response : tax))
          : [...prev, response]
      );
      setVisible(false);
    }
  };

  const clearSearch = () => setGlobalFilter("");

  const taxActions = (rowData: any) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-text p-button-primary p-button-sm"
      onClick={() => openSidebar(rowData)}
    />
  );

  return (
    <div>
      <div className="text-xl font-semibold text-color mb-1">Taxes</div>
      <div className="text-color-secondary">
        Define and manage tax rules, rates, and policies for your system.
      </div>
      <div className="flex justify-content-between align-items-center mb-4 mt-5">
        <div className="flex gap-2">
          <Button
            label="Add Tax"
            icon="pi pi-plus"
            className="p-button-primary p-button-sm"
            onClick={() => openSidebar(null)}
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-text p-button-sm"
            onClick={fetchTaxes}
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
            placeholder="Search Taxes"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>
      <DataTable
        value={taxes}
        className="p-datatable-sm"
        paginator
        rows={10}
        globalFilter={globalFilter}
      >
        <Column field="taxName" header="Name" sortable></Column>
        <Column field="taxType" header="Type" sortable></Column>
        <Column field="taxRate" header="Rate (%)" sortable></Column>
        <Column field="created" header="Created" sortable></Column>
        <Column header="Actions" body={taxActions}></Column>
      </DataTable>
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        className="w-30rem"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-2 text-xl">
            {selectedTax ? "Edit Tax Rate" : "Add Tax Rate"}
          </div>
          <Divider />
          <div className="p-fluid grid mt-3">
            <div className="col-12 mb-3">
              <label htmlFor="taxName">Name *</label>
              <InputText
                id="taxName"
                name="taxName"
                value={formData.taxName}
                onChange={handleInputChange}
                className="p-inputtext-sm"
              />
              {errors.taxName && (
                <small className="p-error">{errors.taxName}</small>
              )}
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="taxRate">Rate (%) *</label>
              <InputText
                id="taxRate"
                name="taxRate"
                value={
                  formData.taxRate !== null ? formData.taxRate.toString() : ""
                }
                onChange={handleInputChange}
                className="p-inputtext-sm"
              />
              {errors.taxRate && (
                <small className="p-error">{errors.taxRate}</small>
              )}
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="taxType">Type</label>
              <Dropdown
                id="taxType"
                value={formData.taxType}
                options={typeOptions}
                onChange={handleDropdownChange}
                className="p-dropdown-sm"
              />
            </div>
          </div>
          <Button
            label="Save"
            icon="pi pi-check"
            className="p-button-sm p-button-primary mt-3"
            type="submit"
          />
        </form>
      </Sidebar>
    </div>
  );
};

export default TaxSettings;
