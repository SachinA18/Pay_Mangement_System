import React, { useState, useEffect, useMemo } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";

import ApiService from "../../services/api.service";
import { Divider } from "primereact/divider";

const defaultFormData: any = {
  id: "00000000-0000-0000-0000-000000000000",
  tenantId: localStorage.getItem("tenantId"),
  name: "",
  code: "",
  rate: 0,
  precision: 0,
  symbol: "",
  symbolPosition: 1,
  isDefaultCurrency: false,
  isActive: true,
  created: "",
  createdBy: "",
  updated: "",
  updatedBy: "",
};

const symbolPositionOptions = [
  { label: "Before Amount", value: 1 },
  { label: "After Amount", value: 2 },
];

const precisionOptions = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const CurrencySettings = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any | null>(null);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState<any>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const apiService = useMemo(() => new ApiService("CurrencySettings"), []);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    const response: any = await apiService.get();
    if (Array.isArray(response)) {
      setCurrencies(response);
    }
  };

  const openSidebar = (currency: any) => {
    setSelectedCurrency(currency);
    setFormData(currency ? { ...currency } : { ...defaultFormData });
    setErrors({});
    setVisible(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownChange = (e: any, fieldName: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: e.value }));
    setErrors((prev: any) => ({ ...prev, [fieldName]: "" }));
  };

  const handleCheckboxChange = (e: any, fieldName: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: e.checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.code) newErrors.code = "Code is required.";
    if (!formData.rate || isNaN(Number(formData.rate)))
      newErrors.rate = "Rate must be a valid number.";
    if (!formData.symbol) newErrors.symbol = "Symbol is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCurrency = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (validateForm()) {
      const response: any = selectedCurrency
        ? await apiService.put(formData)
        : await apiService.post(formData);

      if (response.id) {
        setCurrencies((prev: typeof currencies) =>
          selectedCurrency
            ? prev.map((currency) =>
                currency.id === response.id ? response : currency
              )
            : [...prev, response]
        );

        setFormData({ ...defaultFormData });
        setVisible(false);
      }
    }
  };

  const getStatusTag = (isActive: boolean) => (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "success" : "danger"}
      rounded
    />
  );

  const currencyActions = (rowData: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-primary p-button-sm"
        onClick={() => openSidebar(rowData)}
      />
    </div>
  );

  function clearSearch(): void {
    setGlobalFilter("");
  }

  return (
    <div>
      <div className="text-xl font-semibold text-color mb-1">Currencies</div>
      <div className="text-color-secondary">
        Add, edit, view & manage currencies.
      </div>
      <div className="flex justify-content-between align-items-center mb-4 mt-5">
        <div className="flex gap-2">
          <Button
            label="Add Currency"
            icon="pi pi-plus"
            className="p-button-primary p-button-sm"
            onClick={() => openSidebar("add")}
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
        value={currencies}
        className="p-datatable-sm"
        paginator
        rows={25}
      >
        <Column
          field="name"
          header="Name"
          sortable
          className="text-color-secondary"
        ></Column>
        <Column
          field="code"
          header="Code"
          sortable
          className="text-color-secondary"
        ></Column>
        <Column
          field="rate"
          header="Rate"
          sortable
          className="text-color-secondary"
        ></Column>
        <Column
          field="symbol"
          header="Symbol"
          sortable
          className="text-color-secondary"
        ></Column>
        <Column
          field="isActive"
          header="Status"
          body={(rowData) => getStatusTag(rowData.isActive)}
        ></Column>
        <Column header="Actions" body={currencyActions}></Column>
      </DataTable>
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        className="w-30rem"
      >
        <div className="mb-2 text-xl">
          {formData.name ? "Edit Currency" : "Add Currency"}
        </div>
        {formData.name && <div className="text-sm">ID: {formData.id}</div>}
        <Divider />
        <div className="p-fluid grid mt-3">
          <div className="col-7">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="p-inputtext-sm"
              autoFocus
              autoComplete="off"
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>
          <div className="col-5">
            <label htmlFor="code">Code</label>
            <InputText
              id="code"
              name="code"
              value={formData.code || ""}
              onChange={handleInputChange}
              className="p-inputtext-sm"
              autoComplete="off"
            />
            {errors.code && <small className="p-error">{errors.code}</small>}
          </div>
          <div className="col-6">
            <label htmlFor="rate">Rate</label>
            <InputText
              id="rate"
              name="rate"
              value={formData.rate || ""}
              onChange={handleInputChange}
              className="p-inputtext-sm"
              autoComplete="off"
            />
            {errors.rate && <small className="p-error">{errors.rate}</small>}
          </div>
          <div className="col-6">
            <label htmlFor="precision">Precision</label>
            <Dropdown
              id="precision"
              value={formData.precision}
              options={precisionOptions}
              onChange={(e) => handleDropdownChange(e, "precision")}
              className="p-dropdown-sm"
            />
          </div>
          <div className="col-5">
            <label htmlFor="symbol">Symbol</label>
            <InputText
              id="symbol"
              name="symbol"
              value={formData.symbol || ""}
              onChange={handleInputChange}
              className="p-inputtext-sm"
              autoComplete="off"
            />
            {errors.symbol && (
              <small className="p-error">{errors.symbol}</small>
            )}
          </div>
          <div className="col-7">
            <label htmlFor="symbolPosition">Symbol Position</label>
            <Dropdown
              id="symbolPosition"
              value={formData.symbolPosition}
              options={symbolPositionOptions}
              onChange={(e) => handleDropdownChange(e, "symbolPosition")}
              className="p-dropdown-sm"
              autoComplete="off"
            />
          </div>

          <div className="col-12 mt-3 mb-3">
            <Checkbox
              inputId="isDefaultCurrency"
              checked={formData.isDefaultCurrency}
              onChange={(e) => handleCheckboxChange(e, "isDefaultCurrency")}
            />
            <label htmlFor="isDefaultCurrency" className="ml-2">
              Default Currency
            </label>
          </div>

          <div className="col-12 mb-3">
            <Checkbox
              inputId="isActive"
              checked={formData.isActive}
              onChange={(e) => handleCheckboxChange(e, "isActive")}
            />
            <label htmlFor="isActive" className="ml-2">
              Active
            </label>
          </div>
        </div>

        <Button
          label="Save"
          icon="pi pi-check"
          className="p-button-sm p-button-primary mt-3"
          onClick={saveCurrency}
        />
      </Sidebar>
    </div>
  );
};

export default CurrencySettings;
