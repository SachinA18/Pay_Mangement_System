import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { ColorPicker } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

const InvoiceSettings = () => {
  const [formData, setFormData] = useState({
    numberPrefix: "INV-",
    numberDigit: 5,
    nextNumber: 1,
    paymentTerms: "Due upon receipt",
    template: "Default",
    color: "#5c6bc0",
    title: "Invoice",
    notes: "",
    footer: "",
  });

  const numberDigitOptions = [
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
  ];

  const paymentTermsOptions = [
    { label: "Due upon receipt", value: "Due upon receipt" },
    { label: "Net 15", value: "Net 15" },
    { label: "Net 30", value: "Net 30" },
    { label: "Net 60", value: "Net 60" },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (value: any) => {
    setFormData({ ...formData, template: value });
  };

  return (
    <div className="width-800">
      <h2 className="mt-2 mb-2">Invoice</h2>
      <div className="text-secondary mb-4">
        Configure your invoice settings such as numbering, templates, and notes.
      </div>
      <form>
        <div className="grid p-fluid">
          {/* First Row */}
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="numberPrefix">Number Prefix</label>
              <InputText
                id="numberPrefix"
                name="numberPrefix"
                value={formData.numberPrefix}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="numberDigit">Number Digit</label>
              <Dropdown
                id="numberDigit"
                name="numberDigit"
                value={formData.numberDigit}
                options={numberDigitOptions}
                onChange={(e) => handleDropdownChange("numberDigit", e.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="nextNumber">Next Number</label>
              <InputText
                id="nextNumber"
                name="nextNumber"
                value={formData.nextNumber.toString()}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="paymentTerms">Payment Terms</label>
              <Dropdown
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                options={paymentTermsOptions}
                onChange={(e) => handleDropdownChange("paymentTerms", e.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12">
            <div className="field">
              <label>Template</label>
              <div className="flex align-items-center gap-4">
                {["Default", "Classic", "Modern"].map((template) => (
                  <div key={template}>
                    <RadioButton
                      inputId={template}
                      value={template}
                      onChange={(e) => handleRadioChange(e.value)}
                      checked={formData.template === template}
                    />
                    <label htmlFor={template} className="ml-2">
                      {template}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="color">Colour *</label>
              <ColorPicker
                id="color"
                name="color"
                value={formData.color}
                onChange={(e) => handleDropdownChange("color", e.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12">
            <div className="field">
              <label htmlFor="notes">Notes</label>
              <InputTextarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="col-12">
            <div className="field">
              <label htmlFor="footer">Footer</label>
              <InputTextarea
                id="footer"
                name="footer"
                rows={3}
                value={formData.footer}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-primary"
          />
          <Button type="button" label="Cancel" className="p-button-text ml-3" />
        </div>
      </form>
    </div>
  );
};

export default InvoiceSettings;
