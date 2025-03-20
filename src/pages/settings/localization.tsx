import React, { useState, useEffect, useMemo, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ApiService from "../../services/api.service";

const DefaultSettings = () => {
  const [formData, setFormData] = useState({
    tenantId: localStorage.getItem("tenantId") || "",
    financialYearStart: 1,
    financialYearDenote: 1,
    dateFormat: 1,
    dateSeparator: 1,
    percentPosition: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState<any>({});
  const [options, setOptions] = useState({
    financialYearStartList: [],
    financialYearDenoteList: [],
    dateSeparatorList: [],
    percentPositionList: [],
    dateFormatList: [],
  });

  const toast = useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("LocalizationSettings"), []);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchOptions();
    fetchData();
  }, []);

  const fetchOptions = async () => {
    try {
      const response: any = await apiService.get("defaults");
      console.log(response);
      if (response) {
        setOptions({
          financialYearStartList: response.financialYearStartList.map(
            (item: any) => ({
              label: item.value,
              value: item.key,
            })
          ),
          financialYearDenoteList: response.financialYearDenoteList.map(
            (item: any) => ({
              label: item.value,
              value: item.key,
            })
          ),
          dateSeparatorList: response.dateSeparatorList.map((item: any) => ({
            label: item.value,
            value: item.key,
          })),
          percentPositionList: response.percentPositionList.map((item: any) => ({
            label: item.value,
            value: item.key,
          })),
          dateFormatList: response.dateFormatList.map((item: any) => ({
            label: item.value,
            value: item.key,
          })),
        });
      } else {
        throw new Error("Failed to fetch options.");
      }
    } catch (error) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Unable to fetch options.",
        life: 3000,
      });
    }
  };

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

  const handleDropdownChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const validationErrors: any = {};
    if (!formData.tenantId) {
      validationErrors.tenantId = "Tenant ID is required.";
    }
    if (!formData.dateFormat) {
      validationErrors.dateFormat = "Date Format is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        ...formData,
        tenantId: localStorage.getItem("tenantId"),
      };

      let response: any;
      if (isEdit) {
        response = await apiService.put(payload);
      } else {
        response = await apiService.post(payload);
      }

      if (response && typeof response === 'object' && 'id' in response) {
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
              <label htmlFor="financialYearStart">Financial Year Start</label>
              <Dropdown
                id="financialYearStart"
                name="financialYearStart"
                optionLabel="label"
                optionValue="value"
                value={formData.financialYearStart}
                options={options.financialYearStartList}
                onChange={(e) =>
                  handleDropdownChange("financialYearStart", e.value)
                }
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="financialYearDenote">Financial Year Denote</label>
              <Dropdown
                id="financialYearDenote"
                name="financialYearDenote"
                optionLabel="label"
                optionValue="value"
                value={formData.financialYearDenote}
                options={options.financialYearDenoteList}
                onChange={(e) =>
                  handleDropdownChange("financialYearDenote", e.value)
                }
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="dateFormat">Date Format</label>
              <Dropdown
                id="dateFormat"
                name="dateFormat"
                optionLabel="label"
                optionValue="value"
                value={formData.dateFormat}
                options={options.dateFormatList}
                onChange={(e) => handleDropdownChange("dateFormat", e.value)}
                className={errors.dateFormat ? "p-invalid" : ""}
              />
              {errors.dateFormat && (
                <small className="p-error block mt-1">
                  {errors.dateFormat}
                </small>
              )}
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="dateSeparator">Date Separator</label>
              <Dropdown
                id="dateSeparator"
                name="dateSeparator"
                optionLabel="label"
                optionValue="value"
                value={formData.dateSeparator}
                options={options.dateSeparatorList}
                onChange={(e) => handleDropdownChange("dateSeparator", e.value)}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="percentPosition">Percent Position</label>
              <Dropdown
                id="percentPosition"
                name="percentPosition"
                optionLabel="label"
                optionValue="value"
                value={formData.percentPosition}
                options={options.percentPositionList}
                onChange={(e) =>
                  handleDropdownChange("percentPosition", e.value)
                }
              />
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
