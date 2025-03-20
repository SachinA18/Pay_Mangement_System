import React, { useState, useMemo, useEffect } from "react";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import ApiService from "../../services/api.service";

const DefaultSettings = () => {
  const [formData, setFormData] = useState({
    tenantId: localStorage.getItem("tenantId"),
    bankAccount: 1,
    currency: "AUD",
    tax: 1,
    paymentMethod: 1,
    recordsPerPage: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState({
    tenantId: localStorage.getItem("tenantId"),
    bankAccount: "",
    currency: "",
    tax: "",
    paymentMethod: "",
    recordsPerPage: "",
  });

  const toast = React.useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("DefaultSettings"), []);

  const [isEdit, setIsEdit] = useState(false);

  const bankAccountOptions = [
    { label: "Cash ($)", value: 1 },
    { label: "Bank Transfer", value: 2 },
  ];

  const currencyOptions = [
    { label: "Australian Dollar", value: "AUD" },
    { label: "US Dollar", value: "USD" },
    { label: "Euro", value: "EUR" },
  ];

  const taxOptions = [
    { label: "GST", value: 1 },
    { label: "VAT", value: 2 },
  ];

  const paymentMethodOptions = [
    { label: "Cash", value: 1 },
    { label: "Credit Card", value: 2 },
    { label: "Bank Transfer", value: 3 },
  ];

  const recordsPerPageOptions = [
    { label: "10", value: 1 },
    { label: "25", value: 2 },
    { label: "50", value: 3 },
    { label: "100", value: 4 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response: any = await apiService.get();
    if (response.tenantId) {
      setFormData(response);
      setIsEdit(true);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Configure Company Settings",
        detail: "Please configure your company settings.",
        life: 3000,
      });
    }
  };

  const validateForm = () => {
    const validationErrors: any = {};

    if (!formData.bankAccount) {
      validationErrors.bankAccount = "Bank Account is required.";
    }
    if (!formData.currency) {
      validationErrors.currency = "Currency is required.";
    }
    if (!formData.tax) {
      validationErrors.tax = "Tax is required.";
    }
    if (!formData.paymentMethod) {
      validationErrors.paymentMethod = "Payment Method is required.";
    }
    if (!formData.recordsPerPage) {
      validationErrors.recordsPerPage = "Records per Page is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e: DropdownChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (errors) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        tenantId: localStorage.getItem("tenantId"),
        bankAccount: formData.bankAccount,
        currency: formData.currency,
        tax: formData.tax,
        paymentMethod: formData.paymentMethod,
        language: 1,
        recordsPerPage: formData.recordsPerPage,
        isActive: true,
      };

      let response: { id?: string };
      if (isEdit) {
        response = await apiService.put(payload) as { id?: string };
      } else {
        response = await apiService.put(payload) as { id?: string };
      }

      if (response?.id) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Company settings saved successfully.",
          life: 3000,
        });
      }
    }
  };

  return (
    <div className="width-800">
      <Toast ref={toast} position="bottom-right" />
      <div className="text-xl font-semibold text-color mb-1">Default</div>
      <div className="text-color-secondary">
        Configure the default settings for your application.
      </div>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="grid p-fluid text-color">
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="bankAccount">Bank Account</label>
              <Dropdown
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                options={bankAccountOptions}
                onChange={handleInputChange}
                className={errors.bankAccount ? "p-invalid" : ""}
              />
              {errors.bankAccount && (
                <small className="p-error block mt-1">
                  {errors.bankAccount}
                </small>
              )}
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="currency">Currency</label>
              <Dropdown
                id="currency"
                name="currency"
                value={formData.currency}
                options={currencyOptions}
                onChange={handleInputChange}
                className={errors.currency ? "p-invalid" : ""}
              />
              {errors.currency && (
                <small className="p-error block mt-1">{errors.currency}</small>
              )}
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="tax">Tax</label>
              <Dropdown
                id="tax"
                name="tax"
                value={formData.tax}
                options={taxOptions}
                onChange={handleInputChange}
                className={errors.tax ? "p-invalid" : ""}
              />
              {errors.tax && (
                <small className="p-error block mt-1">{errors.tax}</small>
              )}
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="paymentMethod">Payment Method</label>
              <Dropdown
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                options={paymentMethodOptions}
                onChange={handleInputChange}
                className={errors.paymentMethod ? "p-invalid" : ""}
              />
              {errors.paymentMethod && (
                <small className="p-error block mt-1">
                  {errors.paymentMethod}
                </small>
              )}
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="recordsPerPage">Records Per Page</label>
              <Dropdown
                id="recordsPerPage"
                name="recordsPerPage"
                value={formData.recordsPerPage}
                options={recordsPerPageOptions}
                onChange={handleInputChange}
                className={errors.recordsPerPage ? "p-invalid" : ""}
              />
              {errors.recordsPerPage && (
                <small className="p-error block mt-1">
                  {errors.recordsPerPage}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="flex mt-3">
          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-primary p-button-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default DefaultSettings;
