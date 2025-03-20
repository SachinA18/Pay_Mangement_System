import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface JournalEntry {
  id?: number;
  date: Date;
  reference: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  remarks: string;
}

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onSubmit?: (entry: JournalEntry) => void;
  onCancel?: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  entry,
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = useState<Date | null>(entry?.date || null);
  const [reference, setReference] = useState<string>(entry?.reference || "");
  const [description, setDescription] = useState<string>(
    entry?.description || ""
  );
  const [amount, setAmount] = useState<number | null>(entry?.amount || null);
  const [type, setType] = useState<"debit" | "credit">(entry?.type || "debit");
  const [remarks, setRemarks] = useState<string>(entry?.remarks || "");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const transactionTypes = [
    { label: "Debit", value: "debit" },
    { label: "Credit", value: "credit" },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!date) newErrors.date = "Date is required";
    if (!reference.trim()) newErrors.reference = "Reference is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (amount === null || amount <= 0)
      newErrors.amount = "Amount must be greater than zero";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newEntry: JournalEntry = {
        id: entry?.id || Date.now(),
        date: date as Date,
        reference,
        description,
        amount: amount as number,
        type,
        remarks,
      };
      if (onSubmit) onSubmit(newEntry);
    }
  };

  return (
    <form className=" p-2">
      <h3 className="text-xl font-bold mb-4">
        {entry ? "Edit Journal Entry" : "Add Journal Entry"}
      </h3>
      <div className="grid formgrid p-fluid">
        <div className="col-12 md:col-6 mb-3">
          <label htmlFor="date" className="font-bold mb-1 block">
            Date
          </label>
          <Calendar
            id="date"
            value={date}
            onChange={(e) => setDate(e.value as Date)}
            className={`p-inputtext-sm ${errors.date ? "p-invalid" : ""}`}
            showIcon
            dateFormat="yy-mm-dd"
            placeholder="Select Date"
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
        </div>

        <div className="col-12 md:col-6 mb-3">
          <label htmlFor="reference" className="font-bold mb-1 block">
            Reference
          </label>
          <InputText
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className={`p-inputtext-sm ${errors.reference ? "p-invalid" : ""}`}
            placeholder="Enter reference number"
          />
          {errors.reference && (
            <small className="p-error">{errors.reference}</small>
          )}
        </div>

        <div className="col-12 md:col-6 mb-3">
          <label htmlFor="amount" className="font-bold mb-1 block">
            Amount
          </label>
          <InputNumber
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.value as number)}
            className={`p-inputtext-sm ${errors.amount ? "p-invalid" : ""}`}
            placeholder="Enter amount"
            mode="currency"
            currency="USD"
          />
          {errors.amount && <small className="p-error">{errors.amount}</small>}
        </div>

        <div className="col-12 md:col-6 mb-3">
          <label htmlFor="type" className="font-bold mb-1 block">
            Transaction Type
          </label>
          <Dropdown
            id="type"
            value={type}
            options={transactionTypes}
            onChange={(e) => setType(e.value)}
            placeholder="Select type"
            className="p-inputtext-sm"
          />
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="description" className="font-bold mb-1 block">
            Description
          </label>
          <InputText
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-inputtext-sm ${
              errors.description ? "p-invalid" : ""
            }`}
            placeholder="Enter description"
          />
          {errors.description && (
            <small className="p-error">{errors.description}</small>
          )}
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="remarks" className="font-bold mb-1 block">
            Remarks
          </label>
          <InputTextarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="p-inputtext-sm"
            placeholder="Additional remarks"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-primary p-button-sm"
          onClick={handleSubmit}
        />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-text p-button-sm"
          onClick={onCancel}
        />
      </div>
    </form>
  );
};

export default JournalEntryForm;
