import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { FileUpload } from "primereact/fileupload";

import { fixedAmount } from "../../helpers/template.helper";

import ApiService from "../../services/api.service";
import {
  amountOptions,
  defaultGUID,
  defaultQuotation,
  defaultQuotationItem,
  errorState,
} from "./quotation-defaults";

export default function QuotationForm() {
  const apiService = useMemo(() => new ApiService("Quote"), []);
  const contactService = useMemo(() => new ApiService("contacts"), []);
  const currencyService = useMemo(() => new ApiService("CurrencySettings"), []);
  const itemService = useMemo(() => new ApiService("items"), []);

  const [isCardVisible, setIsCardVisible] = useState(false);

  const { id } = useParams();

  const toast = useRef<Toast>(null);

  const [contacts, setContacts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);

  const [formState, setFormState] = useState({ ...defaultQuotation });
  const [errors, setErrors] = useState({ ...errorState });
  const [searchQuery, setSearchQuery] = useState("");

  const [fields, setFields] = useState({
    tableFields: {
      item: true,
      description: true,
      qty: true,
      price: true,
      taxRate: true,
      amount: true,
    },
  });

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [
    { label: "Quotations", url: "/quotations" },
    { label: "New Quotation" },
  ];

  useEffect(() => {
    fetchData();
  }, [id, contactService, currencyService, itemService, apiService]);

  const fetchData = () => {
    Promise.all([
      contactService.get(),
      currencyService.get(),
      itemService.get(),
    ]).then(([contactsRes, currenciesRes, itemsRes]) => {
      setContacts(Array.isArray(contactsRes) ? contactsRes : []);
      setCurrencies(Array.isArray(currenciesRes) ? currenciesRes : []);
      setItemsList(Array.isArray(itemsRes) ? itemsRes : []);

      if (id !== defaultGUID) {
        return apiService.getById(id).then((result: any) => {
          if (result) {
            setFormState(() => ({
              ...defaultQuotation,
              ...result.quoteModel,
            }));
            setErrors({ ...errorState });
          }
        });
      }
    });
  };
  const subtotal = formState.quoteItems.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  const totalTax = formState.quoteItems.reduce(
    (sum, i) => sum + (i.qty * i.price * i.taxRate) / 100,
    0
  );

  const total = formState.lineAmountType === 2 ? subtotal + totalTax : subtotal;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleItemChange = (rowIndex: number, value: string) => {
    const found = itemsList.find((p) => p.id === value);
    setFormState((prev) => ({
      ...prev,
      quoteItems: prev.quoteItems.map((item, idx) =>
        idx === rowIndex && found
          ? {
              ...item,
              itemId: found.id,
              description: found.description,
              price: found.salePrice ?? 100,
              taxRate: found.taxRate ?? 0,
            }
          : item
      ),
    }));
  };

  const handleQtyChange = (rowIndex: number, value: number) => {
    setFormState((prev) => ({
      ...prev,
      quoteItems: prev.quoteItems.map((item, idx) =>
        idx === rowIndex ? { ...item, qty: value } : item
      ),
    }));
  };

  const addNewRow = () => {
    setFormState((prev) => ({
      ...prev,
      quoteItems: [...prev.quoteItems, { ...defaultQuotationItem }],
    }));
  };

  const deleteRow = (rowIndex: number) => {
    setFormState((prev) => ({
      ...prev,
      quoteItems: prev.quoteItems.filter((_, idx) => idx !== rowIndex),
    }));
  };

  const validateForm = () => {
    const e = { ...errorState };
    let valid = true;

    if (formState.contactId === defaultGUID) {
      e.contactId = "To field is required.";
      valid = false;
    }

    if (!formState.quoteDate) {
      e.quoteDate = "Quotation date is required.";
      valid = false;
    }

    if (!formState.expiryDate) {
      e.expiryDate = "Due date is required.";
      valid = false;
    } else if (new Date(formState.quoteDate) > new Date(formState.expiryDate)) {
      e.expiryDate = "Due date must be later than the quotation date.";
      valid = false;
    }

    if (!formState.quoteNumber?.trim()) {
      e.quoteNumber = "Quotation number is required.";
      valid = false;
    }

    if (formState.quoteItems.some((itm: any) => !itm.itemId || itm.qty <= 0)) {
      e.items = "All items must be selected and have a valid quantity.";
      valid = false;
    }

    if (formState.currencyId === defaultGUID) {
      e.currencyId = "Currency is required.";
      valid = false;
    }

    setErrors(e);
    return valid;
  };

  const handleSubmit = async (action: "save" | "approve") => {
    if (!validateForm()) {
      toast.current?.show({
        severity: "error",
        summary: "Form Error",
        detail: "Form has errors, please correct them",
      });
      return;
    }

    formState.subTotal = subtotal;
    formState.total = total;
    formState.totalTax = totalTax;

    let response: any;
    if (formState.id === defaultGUID) {
      response = await apiService.post(formState);
    } else {
      response = await apiService.put(formState);
    }
    if (response?.id) {
      toast.current?.show({
        severity: "success",
        summary: action === "save" ? "Quotation Saved" : "Quotation Approved",
        detail:
          action === "save"
            ? "Quotation saved successfully"
            : "Quotation approved and emailed successfully",
      });
    }
  };

  const handleSaveClose = () => {
    handleSubmit("save");
  };

  const handleApproveEmail = () => {
    handleSubmit("approve");
  };

  const toggleField = (category: any, field: any) => {
    setFields((prevState: any) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [field]: !prevState[category][field],
      },
    }));
  };

  const renderCheckboxList = (category: any, fieldsObj: any) => {
    return Object.keys(fieldsObj).map((field) => (
      <div key={field} className="field-checkbox p-field-checkbox">
        <Checkbox
          inputId={field}
          checked={fieldsObj[field]}
          onChange={() => toggleField(category, field)}
        />
        <label htmlFor={field} className="ml-2">
          {field}
        </label>
      </div>
    ));
  };

  const handleRowReorder = (event: any) => {
    setFormState((prev) => ({
      ...prev,
      quoteItems: event.value,
    }));
  };

  const onUpload = () => {
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div className="p-card m-3 p-4">
      <Toast ref={toast} />
      <BreadCrumb
        model={breadcrumbItems}
        home={breadcrumbHome}
        className="mb-3 text-700 bg-transparent border-none p-0"
      />
      <div className="text-600 text-3xl my-4 font-medium">
        Create New Quotation
      </div>
      <p className="text-600">
        Accordions condense information visually <br /> and limit the display of
        information to one kind at a time by default.
      </p>
      <div className="grid mb-3 mt-4 p-fluid">
        <div className="col-3 field">
          <label className="text-600">Contact</label>
          <Dropdown
            value={formState.contactId}
            options={contacts}
            optionLabel="contactName"
            optionValue="id"
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, contactId: e.value }))
            }
            placeholder="Select a contact"
          />
          {errors.contactId && (
            <small className="p-error">{errors.contactId}</small>
          )}
        </div>
        <div className="col-2 field">
          <label className="text-600">Issue Date</label>
          <Calendar
            value={
              formState.quoteDate ? new Date(formState.quoteDate) : undefined
            }
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                quoteDate:
                  e.value instanceof Date
                    ? e.value.toISOString().split("T")[0]
                    : "",
              }))
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="p-button-secondary"
          />
          {errors.quoteDate && (
            <small className="p-error">{errors.quoteDate}</small>
          )}
        </div>
        <div className="col-2 field">
          <label htmlFor="expiryDate" className="text-600">
            Expiry date
          </label>
          <Calendar
            id="expiryDate"
            value={
              formState.expiryDate ? new Date(formState.expiryDate) : undefined
            }
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                expiryDate:
                  e.value instanceof Date
                    ? e.value.toISOString().split("T")[0]
                    : "",
              }))
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="p-button-secondary"
          />
          {errors.expiryDate && (
            <small className="p-error">{errors.expiryDate}</small>
          )}
        </div>
        <div className="col-2 field">
          <label className="text-600">Quotation Number</label>
          <InputText
            placeholder="# QU-0001"
            value={formState.quoteNumber}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                quoteNumber: e.target.value,
              }))
            }
          />
          {errors.quoteNumber && (
            <small className="p-error">{errors.quoteNumber}</small>
          )}
        </div>
        <div className="col-3 field">
          <label className="text-600">Reference</label>
          <InputText
            placeholder="Reference"
            value={formState.reference}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, reference: e.target.value }))
            }
          />
        </div>
        <div className="col-3 field">
          <label className="text-600">Project</label>
          <div className="flex flex-wrap align-items-center gap-3 mb-4">
            <span className="p-input-icon-left w-30rem">
              <InputText
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Assign to project"
                className="w-full"
              />
            </span>
          </div>
        </div>
        <div className="col-3 field">
          <label className="text-600">Amounts are</label>
          <Dropdown
            value={formState.lineAmountType}
            options={amountOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, lineAmountType: e.value }))
            }
          />
        </div>
        <div className="col-3 field">
          <label className="text-600">Currency</label>
          <Dropdown
            value={formState.currencyId}
            options={currencies}
            optionLabel="name"
            optionValue="id"
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, currencyId: e.value }))
            }
          />
          {errors.currencyId && (
            <small className="p-error">{errors.currencyId}</small>
          )}
        </div>
      </div>

      <div className="col-6" style={{ position: "relative" }}>
        <Button
          className="p-button-outlined mt-2 mb-2"
          label="Show/Hide Columns"
          onClick={() => setIsCardVisible(!isCardVisible)}
        />
        {isCardVisible && (
          <div
            className="card shadow-1 border-1 border-rounded"
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              zIndex: 10,
              width: "20rem",
              marginTop: "0.5rem",
              background: "white",
            }}
          >
            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-2 px-3 pt-2">
              <h5 className="m-0">Show/Hide Fields</h5>
              <Button
                className="p-button-text p-button-danger p-0"
                icon="pi pi-times"
                onClick={() => setIsCardVisible(false)}
              />
            </div>
            <div className="px-3 py-2">
              <p className="mb-3">
                Select fields depending on your invoicing needs. This won't
                change how your invoices look to customers.
              </p>
              <div>
                <h5>Table fields</h5>
                <div className="grid gap-2 col-1">
                  {renderCheckboxList("tableFields", fields.tableFields)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <DataTable
          value={formState.quoteItems}
          reorderableRows
          onRowReorder={handleRowReorder}
          showGridlines
          size="small"
        >
          <Column rowReorder />
          {fields.tableFields.item && (
            <Column
              header="Item"
              body={(rowData, opt) => (
                <Dropdown
                  value={rowData.itemId}
                  options={itemsList}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) => handleItemChange(opt.rowIndex, e.value)}
                  placeholder="Select an item"
                  className="w-full border-none"
                  showClear
                />
              )}
            />
          )}
          {fields.tableFields.description && (
            <Column
              header="Description"
              body={(rowData, opt) => (
                <InputText
                  value={rowData.description}
                  onChange={(e) =>
                    handleQtyChange(opt.rowIndex, Number(e.target.value))
                  }
                  className="w-full p-inputtext-sm border-none"
                />
              )}
            />
          )}
          {fields.tableFields.qty && (
            <Column
              header="Qty."
              body={(rowData, opt) => (
                <InputText
                  value={rowData.qty}
                  onChange={(e) =>
                    handleQtyChange(opt.rowIndex, Number(e.target.value))
                  }
                  className="w-full p-inputtext-sm border-none"
                />
              )}
            />
          )}
          {fields.tableFields.price && (
            <Column
              header="Price"
              body={(rowData) => fixedAmount(rowData.price)}
            />
          )}
          {fields.tableFields.taxRate && (
            <Column header="Tax Rate (%)" field="taxRate" />
          )}
          {fields.tableFields.amount && (
            <Column
              header="Amount"
              body={(rowData) => fixedAmount(rowData.qty * rowData.price)}
            />
          )}
          <Column
            header="Actions"
            body={(_, opt) => (
              <Button
                onClick={() => deleteRow(opt.rowIndex)}
                className="p-button-danger p-button-text"
                icon="pi pi-trash"
              />
            )}
          />
        </DataTable>
        <Button
          onClick={addNewRow}
          className="p-button-text mt-2"
          label="Add Item"
          icon="pi pi-plus"
        />
      </div>
      <div className="grid mb-3 align-items-start justify-content-between">
        <div className="col-6">
          <FloatLabel className="mb-4 mt-4">
            <InputTextarea
              id="terms"
              value={formState.terms}
              className="w-full"
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  terms: e.target.value,
                }))
              }
              rows={5}
              cols={30}
            />
            <label htmlFor="terms">Terms</label>
          </FloatLabel>
          <label>
            To set and reuse terms, edit your branding theme in{" "}
            <Link to="/settings/invoices">
              invoice settings <i className="pi pi-external-link"></i>
            </Link>
          </label>
          <div className="flex justify-content-start mt-4">
            <FileUpload
              mode="basic"
              name="demo[]"
              url="/api/upload"
              maxFileSize={1000000}
              onUpload={onUpload}
              auto
              chooseLabel="Attach Files"
            />
          </div>
        </div>
        <div className="col-4 text-700">
          <div className="flex justify-content-end mt-4">
            <div className="w-full sm:w-50 lg:w-30">
              <div className="flex justify-content-between align-items-center mb-2">
                <div className="font-medium">Subtotal:</div>
                <div className="text-right">{fixedAmount(subtotal)}</div>
              </div>
              <div className="flex justify-content-between align-items-center mb-2">
                <div className="font-medium">Total Tax:</div>
                <div className="text-right">{fixedAmount(totalTax)}</div>
              </div>
              <div className="flex justify-content-between align-items-center font-bold border-top-1 mt-2 pt-2">
                <div className="text-lg">Total:</div>
                <div className="text-lg text-right">{fixedAmount(total)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-content-end gap-2 mt-4">
        <Button
          onClick={handleSaveClose}
          className="p-button-outlined"
          label="Save & Close"
        />
        <Button
          onClick={handleApproveEmail}
          className="p-button-primary"
          label="Approve & Email"
        />
      </div>
    </div>
  );
}
