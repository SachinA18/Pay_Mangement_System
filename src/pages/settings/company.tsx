import React, { useState, useEffect, FormEvent, useMemo } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ApiService from "../../services/api.service";

const CompanySettings: React.FC = () => {
  const [formData, setFormData] = useState({
    id: "00000000-0000-0000-0000-000000000000",
    name: "",
    email: "",
    address: "",
    phone: "",
    countryId: 0,
    abn: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    countryId?: string;
    abn?: string;
    city?: string;
    postalCode?: string;
    state?: string;
  }>({});

  const [isEdit, setIsEdit] = useState(false);

  const toast = React.useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("tenant"), []);

  const countries = [
    { label: "Australia", value: 1 },
    { label: "United States", value: 2 },
    { label: "United Kingdom", value: 3 },
    { label: "Canada", value: 4 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response: any = await apiService.get();
    if (response.name) {
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

  const handleChange = (e: any): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const validationErrors: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      countryId?: string;
      abn?: string;
      city?: string;
      postalCode?: string;
      state?: string;
    } = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Company Name is required.";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required.";
    }
    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone is required.";
    }
    if (!formData.address.trim()) {
      validationErrors.address = "Company Address is required.";
    }
    if (!formData.countryId) {
      validationErrors.countryId = "Country is required.";
    }
    if (!formData.abn.trim()) {
      validationErrors.abn = "ABN Number is required.";
    }
    if (!formData.city.trim()) {
      validationErrors.city = "City is required.";
    }
    if (!formData.postalCode.trim()) {
      validationErrors.postalCode = "Postal Code is required.";
    }
    if (!formData.state.trim()) {
      validationErrors.state = "State is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please check the form for errors and try again.',
        life: 3000
      });
      return;
    }

    try {
      let response: { id?: string; message?: string };
      if (isEdit) {
        response = await apiService.put(formData) as { id?: string; message?: string };
      } else {
        response = await apiService.post(formData) as { id?: string; message?: string };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: `Company settings ${isEdit ? 'updated' : 'created'} successfully.`,
          life: 3000
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save company settings. Please try again.',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An unexpected error occurred. Please try again.',
        life: 3000
      });
    }
  };

  return (
    <div className="width-800">
      <Toast ref={toast} position="bottom-right" />
      <div className="text-xl font-semibold text-color mb-1">Company</div>
      <div className="text-sm text-color-secondary">
        Update your company settings and contact information.
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ width: "600px" }}
        autoComplete="off"
        className="form-expanded mt-5 text-color"
      >
        <div className="grid p-fluid">
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="name">Company Name *</label>
              <InputText
                id="name"
                name="name"
                className={`w-full ${errors.name ? "p-invalid" : ""}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="p-error block">{errors.name}</small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="email">Email *</label>
              <InputText
                id="email"
                name="email"
                className={`w-full ${errors.email ? "p-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="p-error block">{errors.email}</small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="phone">Phone *</label>
              <InputText
                id="phone"
                name="phone"
                className={`w-full ${errors.phone ? "p-invalid" : ""}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <small className="p-error block">{errors.phone}</small>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="field">
              <label htmlFor="abn">ABN Number *</label>
              <InputText
                id="abn"
                name="abn"
                className={`w-full ${errors.abn ? "p-invalid" : ""}`}
                value={formData.abn}
                onChange={handleChange}
              />
              {errors.abn && (
                <small className="p-error block mt-1">{errors.abn}</small>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="field">
              <label htmlFor="address" className="block text-sm font-medium">
                Company Address *
              </label>
              <InputTextarea
                id="address"
                name="address"
                rows={3}
                className={`w-full ${errors.address ? "p-invalid" : ""}`}
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <small className="p-error block mt-1">{errors.address}</small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="city">Town / City *</label>
              <InputText
                id="city"
                name="city"
                className={`w-full ${errors.city ? "p-invalid" : ""}`}
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && (
                <small className="p-error block mt-1">{errors.city}</small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="postalCode">Postal / Zip Code *</label>
              <InputText
                id="postalCode"
                name="postalCode"
                className={`w-full ${errors.postalCode ? "p-invalid" : ""}`}
                value={formData.postalCode}
                onChange={handleChange}
              />
              {errors.postalCode && (
                <small className="p-error block mt-1">
                  {errors.postalCode}
                </small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="state">Province / State *</label>
              <InputText
                id="state"
                name="state"
                className={`w-full ${errors.state ? "p-invalid" : ""}`}
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && (
                <small className="p-error block mt-1">{errors.state}</small>
              )}
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="countryId" className="block text-sm font-medium">
                Country *
              </label>
              <Dropdown
                id="countryId"
                name="countryId"
                className={`w-full ${errors.countryId ? "p-invalid" : ""}`}
                value={formData.countryId}
                options={countries}
                onChange={handleChange}
              />
              {errors.countryId && (
                <small className="p-error block mt-1">{errors.countryId}</small>
              )}
            </div>
          </div>
        </div>
        <div className="flex mt-3">
          <Button
            type="submit"
            label={isEdit ? "Update Details" : "Save Details"}
            icon="pi pi-check"
            className="p-button-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
