import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import ApiService from "../../services/api.service";
import { fixedAmount } from "../../helpers/template.helper";

interface DropdownOption {
  label: string;
  value: number;
}

interface JournalLineItem {
  id: string;
  description: string;
  accountType: number;
  taxType: number;
  region: number;
  debitUSD: number;
  creditUSD: number;
}

interface JournalEntry {
  id: string;
  narration: string;
  transactionDate: string;
  autoReversingDate?: string;
  isDefaultNarrToJournalLineDesc: boolean;
  isShowJournalOnCashBasisReports: boolean;
  journalLineItems: JournalLineItem[];
}

interface ApiResponse {
  accountList?: Array<{ key: number; value: string }>;
  taxRatesList?: Array<{ key: number; value: string }>;
  regionList?: Array<{ key: number; value: string }>;
}

const defaultGUID = "00000000-0000-0000-0000-000000000000";

const defaultJournalLineItem: JournalLineItem = {
  id: defaultGUID,
  description: "",
  accountType: 0,
  taxType: 0,
  region: 0,
  debitUSD: 0,
  creditUSD: 0,
};

const defaultJournalEntry: JournalEntry = {
  id: defaultGUID,
  narration: "",
  transactionDate: "",
  autoReversingDate: undefined,
  isDefaultNarrToJournalLineDesc: false,
  isShowJournalOnCashBasisReports: false,
  journalLineItems: [{ ...defaultJournalLineItem }],
};

const defaultErrors = {
  narration: "",
  transactionDate: "",
  journalLineItems: "",
  accountType: "",
  taxType: "",
  region: "",
};

const ManualJournal: React.FC = () => {
  const apiService = useMemo(() => new ApiService("JournalEntry"), []);
  const toast = React.useRef<Toast>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<JournalEntry>(defaultJournalEntry);
  const [errors, setErrors] = useState({ ...defaultErrors });
  const [accountTypes, setAccountTypes] = useState<DropdownOption[]>([]);
  const [taxTypes, setTaxTypes] = useState<DropdownOption[]>([]);
  const [regions, setRegions] = useState<DropdownOption[]>([]);

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [
    { label: "Accounting", url: "/accounting" },
    { label: "Manual Journal" },
  ];

  useEffect(() => {
    fetchDefaults();
    if (id && id !== defaultGUID) {
      fetchJournalEntry(id);
    }
  }, [id]);

  const fetchDefaults = async () => {
    try {
      const response = await apiService.get("defaults") as ApiResponse;
      console.log("API Response:", response);
      if (response) {
        const mappedAccountTypes = response.accountList?.map((item) => ({
          label: item.value,
          value: item.key,
        })) || [];
        console.log("Mapped Account Types:", mappedAccountTypes);
        setAccountTypes(mappedAccountTypes);

        const mappedTaxTypes = response.taxRatesList?.map((item) => ({
          label: item.value,
          value: item.key,
        })) || [];
        console.log("Mapped Tax Types:", mappedTaxTypes);
        setTaxTypes(mappedTaxTypes);

        const mappedRegions = response.regionList?.map((item) => ({
          label: item.value,
          value: item.key,
        })) || [];
        console.log("Mapped Regions:", mappedRegions);
        setRegions(mappedRegions);
      }
    } catch (error) {
      console.error("Error fetching defaults:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load defaults",
        life: 3000,
      });
    }
  };

  const fetchJournalEntry = async (journalId: string) => {
    try {
      const response = await apiService.getById(journalId) as JournalEntry[] | JournalEntry;
      if (response) {
        // Handle both array and single object responses
        const journalData = Array.isArray(response) ? response[0] : response;
        if (journalData) {
          // Ensure all required fields are present
          const journalEntry = {
            ...defaultJournalEntry,
            ...journalData,
            journalLineItems: journalData.journalLineItems?.map(item => ({
              ...defaultJournalLineItem,
              ...item,
              debitUSD: Number(item.debitUSD) || 0,
              creditUSD: Number(item.creditUSD) || 0
            })) || [{ ...defaultJournalLineItem }]
          };
          console.log("Setting form data:", journalEntry);
          setFormData(journalEntry);
        }
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load journal entry",
        life: 3000,
      });
    }
  };

  const validateForm = () => {
    const newErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.narration.trim()) {
      newErrors.narration = "Narration is required";
      isValid = false;
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "Transaction date is required";
      isValid = false;
    }

    if (!formData.journalLineItems?.length) {
      newErrors.journalLineItems = "At least one journal line item is required";
      isValid = false;
    }

    const invalidLineItems = formData.journalLineItems?.some(
      (item) =>
        !item.description ||
        !item.accountType ||
        !item.taxType ||
        !item.region ||
        (item.debitUSD === 0 && item.creditUSD === 0)
    );

    if (invalidLineItems) {
      newErrors.journalLineItems =
        "All line items must have description, account type, tax type, region, and either debit or credit amount";
      isValid = false;
    }

    // Check if debits equal credits
    const totalDebits = formData.journalLineItems?.reduce(
      (sum, item) => sum + item.debitUSD,
      0
    );
    const totalCredits = formData.journalLineItems?.reduce(
      (sum, item) => sum + item.creditUSD,
      0
    );

    if (totalDebits !== totalCredits) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Total debits must equal total credits",
        life: 3000,
      });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const totalDebits = formData.journalLineItems.reduce((sum, item) => sum + (Number(item.debitUSD) || 0), 0);
      const totalCredits = formData.journalLineItems.reduce((sum, item) => sum + (Number(item.creditUSD) || 0), 0);
      
      const journalToSubmit = {
        ...formData,
        debitUSDSubTotal: totalDebits,
        debitUSDTaxTotal: 0, // Calculate if needed
        debitUSDTotal: totalDebits,
        creditUSDSubTotal: totalCredits,
        creditUSDTaxTotal: 0, // Calculate if needed
        creditUSDTotal: totalCredits,
        journalLineItems: formData.journalLineItems.map(item => ({
          ...item,
          debitUSD: Number(item.debitUSD) || 0,
          creditUSD: Number(item.creditUSD) || 0
        }))
      };

      let response;
      if (formData.id === defaultGUID) {
        response = await apiService.post(journalToSubmit);
      } else {
        response = await apiService.put(journalToSubmit);
      }

      if (response) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Journal entry saved successfully",
          life: 3000,
        });
        navigate("/accounting/journals");
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save journal entry",
        life: 3000,
      });
    }
  };

  const handleLineItemChange = (index: number, field: keyof JournalLineItem, value: any) => {
    const updatedItems = [...formData.journalLineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData({
      ...formData,
      journalLineItems: updatedItems
    });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      journalLineItems: [...formData.journalLineItems, { ...defaultJournalLineItem }]
    });
  };

  const removeLineItem = (index: number) => {
    const updatedItems = formData.journalLineItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      journalLineItems: updatedItems
    });
  };

  const totalDebits = formData.journalLineItems?.reduce((sum, item) => sum + (item.debitUSD || 0), 0) || 0;
  const totalCredits = formData.journalLineItems?.reduce((sum, item) => sum + (item.creditUSD || 0), 0) || 0;

  return (
    <div className="p-card m-3 p-4">
      <Toast ref={toast} />
      <BreadCrumb
        model={breadcrumbItems}
        home={breadcrumbHome}
        className="mb-3 text-700 bg-transparent border-none p-0"
      />
      <div className="text-600 text-3xl my-4 font-medium">Manual Journal</div>

      <form onSubmit={handleSubmit}>
        <div className="grid mb-3">
          <div className="col-6 field">
            <label htmlFor="narration" className="block mb-2">
              Narration<span className="text-red-500 ml-1">*</span>
            </label>
            <InputText
              id="narration"
              value={formData.narration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, narration: e.target.value }))
              }
              className={`w-full ${errors.narration ? "p-invalid" : ""}`}
            />
            {errors.narration && (
              <small className="p-error">{errors.narration}</small>
            )}
          </div>

          <div className="col-3 field">
            <label htmlFor="transactionDate" className="block mb-2">
              Transaction Date<span className="text-red-500 ml-1">*</span>
            </label>
            <Calendar
              id="transactionDate"
              value={
                formData.transactionDate
                  ? new Date(formData.transactionDate)
                  : null
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  transactionDate:
                    e.value instanceof Date
                      ? e.value.toISOString()
                      : "",
                }))
              }
              dateFormat="yy-mm-dd"
              showIcon
              className={`w-full ${errors.transactionDate ? "p-invalid" : ""}`}
            />
            {errors.transactionDate && (
              <small className="p-error">{errors.transactionDate}</small>
            )}
          </div>

          <div className="col-3 field">
            <label htmlFor="autoReversingDate" className="block mb-2">
              Auto Reversing Date
            </label>
            <Calendar
              id="autoReversingDate"
              value={
                formData.autoReversingDate
                  ? new Date(formData.autoReversingDate)
                  : null
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  autoReversingDate:
                    e.value instanceof Date
                      ? e.value.toISOString()
                      : undefined,
                }))
              }
              dateFormat="yy-mm-dd"
              showIcon
              className="w-full"
            />
          </div>
        </div>

        <div className="grid mb-3">
          <div className="col-6 field">
            <div className="flex align-items-center">
              <Checkbox
                inputId="defaultNarr"
                checked={formData.isDefaultNarrToJournalLineDesc}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefaultNarrToJournalLineDesc: e.checked ?? false,
                  }))
                }
              />
              <label htmlFor="defaultNarr" className="ml-2">
                Default narration to journal line description
              </label>
            </div>
          </div>

          <div className="col-6 field">
            <div className="flex align-items-center">
              <Checkbox
                inputId="showCashBasis"
                checked={formData.isShowJournalOnCashBasisReports}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isShowJournalOnCashBasisReports: e.checked ?? false,
                  }))
                }
              />
              <label htmlFor="showCashBasis" className="ml-2">
                Show journal on cash basis reports
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <DataTable
            value={formData.journalLineItems}
            showGridlines
            size="small"
            className={errors.journalLineItems ? "p-invalid" : ""}
          >
            <Column
              header="Description"
              body={(rowData, { rowIndex }) => (
                <InputText
                  value={rowData.description}
                  onChange={(e) =>
                    handleLineItemChange(rowIndex, "description", e.target.value)
                  }
                  className="w-full"
                />
              )}
            />
            <Column
              header="Account Type"
              body={(rowData, { rowIndex }) => (
                <Dropdown
                  value={rowData.accountType}
                  options={accountTypes}
                  onChange={(e) => handleLineItemChange(rowIndex, "accountType", e.value)}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Account Type"
                  className="w-full"
                />
              )}
            />
            <Column
              header="Tax Type"
              body={(rowData, { rowIndex }) => (
                <Dropdown
                  value={rowData.taxType}
                  options={taxTypes}
                  onChange={(e) => handleLineItemChange(rowIndex, "taxType", e.value)}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Tax Type"
                  className="w-full"
                />
              )}
            />
            <Column
              header="Region"
              body={(rowData, { rowIndex }) => (
                <Dropdown
                  value={rowData.region}
                  options={regions}
                  onChange={(e) => handleLineItemChange(rowIndex, "region", e.value)}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Region"
                  className="w-full"
                />
              )}
            />
            <Column
              header="Debit (USD)"
              body={(rowData, { rowIndex }) => (
                <InputText
                  value={rowData.debitUSD || ""}
                  onChange={(e) =>
                    handleLineItemChange(
                      rowIndex,
                      "debitUSD",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full text-right"
                />
              )}
            />
            <Column
              header="Credit (USD)"
              body={(rowData, { rowIndex }) => (
                <InputText
                  value={rowData.creditUSD || ""}
                  onChange={(e) =>
                    handleLineItemChange(
                      rowIndex,
                      "creditUSD",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full text-right"
                />
              )}
            />
            <Column
              body={(_, { rowIndex }) => (
                <Button
                  icon="pi pi-trash"
                  onClick={() => removeLineItem(rowIndex)}
                  className="p-button-text p-button-danger"
                />
              )}
            />
          </DataTable>

          {errors.journalLineItems && (
            <small className="p-error block mt-2">
              {errors.journalLineItems}
            </small>
          )}

          <Button
            type="button"
            label="Add Line Item"
            icon="pi pi-plus"
            onClick={addLineItem}
            className="p-button-text mt-2"
          />
        </div>

        <div className="grid mb-3">
          <div className="col-8"></div>
          <div className="col-4">
            <div className="flex justify-content-between align-items-center mb-2">
              <div className="font-medium">Total Debits:</div>
              <div className="text-right">{fixedAmount(totalDebits)}</div>
            </div>
            <div className="flex justify-content-between align-items-center mb-2">
              <div className="font-medium">Total Credits:</div>
              <div className="text-right">{fixedAmount(totalCredits)}</div>
            </div>
            <div className="flex justify-content-between align-items-center font-bold border-top-1 mt-2 pt-2">
              <div className="text-lg">Difference:</div>
              <div className="text-lg text-right">
                {fixedAmount(totalDebits - totalCredits)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            className="p-button-text"
            onClick={() => navigate("/accounting/journals")}
          />
          <Button type="submit" label="Save" className="p-button-primary" />
        </div>
      </form>
    </div>
  );
};

export default ManualJournal; 