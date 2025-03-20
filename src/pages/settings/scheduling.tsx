import React, { useState, useEffect, useMemo } from "react";
import { FormEvent } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

import ApiService from "../../services/api.service";

const defaultGUID = '00000000-0000-0000-0000-000000000000';

interface SchedulingSettings {
  id?: string;
  tenantId: string | null;
  sendInvoiceReminder: boolean;
  sendBillReminder: boolean;
  sendAfterDueDays: string;
  sendBeforeDueDays: string;
}

const SchedulingSettings = () => {
  const [formData, setFormData] = useState<SchedulingSettings>({
    id: defaultGUID,
    tenantId: null,
    sendInvoiceReminder: false,
    sendBillReminder: false,
    sendAfterDueDays: '',
    sendBeforeDueDays: ''
  });

  const [isEdit, setIsEdit] = useState(false);

  const toast = React.useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("SchedulingSettings"), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response: any = await apiService.get();
    if (response.tenantId) {
      setIsEdit(true);
      setFormData(response);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const {
      sendInvoiceReminder,
      sendAfterDueDays,
      sendBillReminder,
      sendBeforeDueDays,
    } = formData;

    if (sendInvoiceReminder && !sendAfterDueDays) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Send After Due Days is required.",
        life: 3000,
      });
      return false;
    }
    if (sendBillReminder && !sendBeforeDueDays) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Send Before Due Days is required.",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
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
      if (formData.id === defaultGUID) {
        response = await apiService.post(formData) as { id?: string; message?: string };
      } else {
        response = await apiService.put(formData) as { id?: string; message?: string };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: `Settings ${formData.id === defaultGUID ? 'created' : 'updated'} successfully.`,
          life: 3000
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save settings. Please try again.',
          life: 3000
        });
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="text-xl font-semibold text-color mb-2">Scheduling</div>
      <div className="text-color-secondary text-sm">
        Configure scheduling settings for invoice and bill reminders.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-4 mt-6 text-color">
          <div className="flex">
            <div className="flex align-items-center" style={{ width: "200px" }}>
              <Checkbox
                inputId="sendInvoiceReminder"
                checked={formData.sendInvoiceReminder}
                onChange={(e) =>
                  handleCheckboxChange("sendInvoiceReminder", e.checked)
                }
              />
              <label htmlFor="sendInvoiceReminder" className="ml-2">
                Send Invoice Reminder
              </label>
            </div>

            <InputText
              id="sendAfterDueDays"
              name="sendAfterDueDays"
              value={formData.sendAfterDueDays}
              onChange={handleInputChange}
              disabled={!formData.sendInvoiceReminder}
              required={formData.sendInvoiceReminder}
              placeholder="Send After Due Days"
              className="p-inputtext-sm"
              onKeyDown={(e) => {
                if (!/^\d$/u.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="flex">
            <div className="flex align-items-center" style={{ width: "200px" }}>
              <Checkbox
                inputId="sendBillReminder"
                checked={formData.sendBillReminder}
                onChange={(e) =>
                  handleCheckboxChange("sendBillReminder", e.checked)
                }
              />
              <label htmlFor="sendBillReminder" className="ml-2">
                Send Bill Reminder
              </label>
            </div>

            <InputText
              id="sendBeforeDueDays"
              name="sendBeforeDueDays"
              value={formData.sendBeforeDueDays}
              onChange={handleInputChange}
              disabled={!formData.sendBillReminder}
              required={formData.sendBillReminder}
              placeholder="Send Before Due Days"
              className="p-inputtext-sm"
              onKeyDown={(e) => {
                if (!/^\d$/u.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
        <div className="flex mt-5">
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

export default SchedulingSettings;
