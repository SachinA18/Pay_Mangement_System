import { useEffect, useRef, useState, useMemo } from "react";
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

import { fixedAmount } from "../../helpers/template.helper";

import ApiService from "../../services/api.service";
import {
  amountOptions,
  defaultGUID,
  defaultInvoice,
  defaultInvoiceItem,
  errorState,
  paymentTypes,
} from "./invoice-defaults";

export default function InvoiceForm() {
  const apiService = useMemo(() => new ApiService("Invoice"), []);
  const contactService = useMemo(() => new ApiService("contacts"), []);
  const currencyService = useMemo(() => new ApiService("CurrencySettings"), []);
  const itemService = useMemo(() => new ApiService("items"), []);

  const { id } = useParams();
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const [contacts, setContacts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");

  const [formState, setFormState] = useState({ ...defaultInvoice });
  const [errors, setErrors] = useState({ ...errorState });

  const [isCardVisible, setIsCardVisible] = useState(false);

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [
    { label: "Invoices", url: "/invoices" },
    { label: "New Invoice" },
  ];

  const tabs = ["Notes", "Activities"];

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

  useEffect(() => {
    setTimeout(() => {
      setContacts([
        { id: 1, contactName: "John Doe" },
        { id: 2, contactName: "Jane Smith" },
        { id: 3, contactName: "Alice Johnson" },
        { id: 4, contactName: "Bob Brown" },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCurrencies([
        { id: 1, currencies: "EURO" },
        { id: 2, currencies: "DOLLERS" },
        { id: 3, currencies: "RUPEES" },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setItemsList([
        { id: 1, itemName: "Laptop", price: 1000 },
        { id: 2, itemName: "Monitor", price: 300 },
        { id: 3, itemName: "Keyboard", price: 50 },
        { id: 4, itemName: "Mouse", price: 25 },
      ]);
    }, 500);
  }, []);

  const handleItemChange = (rowIndex:any, selectedItemId:any) => {
    const selectedItem = itemsList.find((item) => item.id === selectedItemId);
    setFormState((prevState) => {
      const updatedItems = [...prevState.invoiceItems];
      updatedItems[rowIndex] = {
        ...updatedItems[rowIndex],
        itemId: selectedItem ? selectedItem.id : "",
        itemName: selectedItem ? selectedItem.itemName : "",
        qty: 1,
        price: selectedItem ? selectedItem.price : 0,
      };
      return { ...prevState, invoiceItems: updatedItems };
    });
  };

  useEffect(() => {
    contactService.get().then((res: any) => setContacts(res || []));
    currencyService.get().then((res: any) => setCurrencies(res || []));
    itemService.get().then((res: any) => setItemsList(res || []));

    if (id !== defaultGUID) {
      apiService
        .getById(id)
        .then((res: any) => setFormState(res.invoiceModel || defaultInvoice));
    }
  }, [contactService, currencyService, itemService, apiService]);

  const subtotal = formState.invoiceItems?.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  const totalTax = formState.invoiceItems?.reduce(
    (sum, i) => sum + (i.qty * i.price * i.taxRate) / 100,
    0
  );

  const total = formState.lineAmountType === 2 ? subtotal + totalTax : subtotal;

  const handleQtyChange = (rowIndex: number, value: number) => {
    setFormState((prev) => ({
      ...prev,
      invoiceItems: prev.invoiceItems.map((item, idx) =>
        idx === rowIndex ? { ...item, qty: value } : item
      ),
    }));
  };

  const addNewRow = () => {
    setFormState((prev) => ({
      ...prev,
      invoiceItems: [...prev.invoiceItems, { ...defaultInvoiceItem }],
    }));
  };

  const deleteRow = (rowIndex: number) => {
    setFormState((prev) => ({
      ...prev,
      invoiceItems: prev.invoiceItems.filter((_, idx) => idx !== rowIndex),
    }));
  };

  const validateForm = () => {
    const e = { ...errorState };
    let valid = true;

      if (formState.contactId === defaultGUID) {
        e.contactId = "To field is required.";
        valid = false;
      }

    if (!formState.date) {
      e.date = "Invoice date is required.";
      valid = false;
    }

    if (!formState.dueDate) {
      e.dueDate = "Due date is required.";
      valid = false;
    } else if (new Date(formState.date) > new Date(formState.dueDate)) {
      e.dueDate = "Due date must be later than the invoice date.";
      valid = false;
    }

    if (!formState.invoiceNumber.trim()) {
      e.invoiceNumber = "Invoice number is required.";
      valid = false;
    }

    if (
      formState.invoiceItems.some((itm: any) => !itm.itemId || itm.qty <= 0)
    ) {
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
        severity: "warn",
        summary: "Validation Error",
        detail: "Please check the form for errors and try again.",
        life: 3000,
      });
      return;
    }

    formState.subTotal = subtotal;
    formState.total = total;
    formState.totalTax = totalTax;

    try {
      let response: { id?: string; message?: string };
      if (formState.id === defaultGUID) {
        response = (await apiService.post(formState)) as {
          id?: string;
          message?: string;
        };
      } else {
        response = (await apiService.put(formState)) as {
          id?: string;
          message?: string;
        };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: "success",
          summary: action === "save" ? "Invoice Saved" : "Invoice Approved",
          detail:
            action === "save"
              ? "Invoice saved successfully"
              : "Invoice approved and emailed successfully",
          life: 3000,
        });
        navigate("/invoices");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            response.message || "Failed to save invoice. Please try again.",
          life: 3000,
        });
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  const handleSaveClose = () => {
    handleSubmit("save");
  };

  const handleApproveEmail = () => {
    handleSubmit("approve");
  };

  const paymentItemTemplate = (option: any) => (
    <div className="flex align-items-center gap-2">
      <img src={option?.icon} alt={option?.label} style={{ height: "16px" }} />
      <span>{option?.label}</span>
    </div>
  );

  const handleBack = (): void => {
    navigate("/invoices");
  }

  const handleSettings = (): void => {
    navigate("/settings/invoices");
  }

  const handlePreview = (): void => {
    navigate("../invoice-preview");
  }

  const handleRowReorder = (event: any) => {
    setFormState((prev) => ({
      ...prev,
      invoiceItems: event.value,
    }));
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

  return (
    <div className="p-card m-3 p-4">
      <Toast ref={toast} />
      <div className="flex items-center justify-between my-1">
        <BreadCrumb
          model={breadcrumbItems}
          home={breadcrumbHome}
          className="mb-3 mt-3 text-700 bg-transparent border-none p-0"
        />
        <div className="flex gap-3 ml-auto mb-2">
          <Button
            onClick={handleBack}
            className="p-button-outlined w-9rem"
            label="Back"
          />
          <Button
            onClick={handleSaveClose}
            className="p-button-secondary"
            label="Save as a draft"
          />
          <Button
            onClick={handleSettings}
            icon="pi pi-cog"
            className="p-button-outlined"
          />
          <Button
            onClick={handlePreview}
            icon="pi pi-eye"
            className="p-button-outlined"
          />
          <Button
            onClick={handleApproveEmail}
            label="Approve & Email"
          />
        </div>
      </div>
      <div className="flex items-center justify-between my-2">
        <div className="text-600 text-3xl font-medium">Create New Invoice</div>
      </div>
      <div className="flex gap-2 justify-content-end mr-3">
        {tabs.map((tab) => (
          <Button
            key={tab}
            label={tab}
            className={`p-button-text w-8rem h-2rem ${selectedTab === tab ? "bg-blue-200 text-gray-800" : "text-gray-800 bg-gray-200"}`}
            onClick={() => setSelectedTab(tab)}
          />
        ))}
      </div>
      <div className="p-card p-4 border-dashed border-gray-300">
        <div>
          <div className="flex items-center justify-between my-1">
            <div className="col-3 field border-round">
              <Dropdown
                className="w-full"
                value={formState.contactId}
                options={contacts}
                optionLabel="contactName"
                optionValue="id"
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, contactId: e.value }))
                }
                placeholder="Select a contact"
              />
              <div>
                {errors.contactId && (
                  <small className="p-error">{errors.contactId}</small>
                )}
              </div>
            </div>
            <div className="col-2 field ml-auto">
              <Calendar
                id="date"
                value={formState.date ? new Date(formState.date) : undefined}
                onChange={(e) => {
                  if (e.value instanceof Date) {
                    const offset = e.value.getTimezoneOffset() * 60000;
                    const localDate = new Date(e.value.getTime() - offset)
                      .toISOString()
                      .split("T")[0];

                    setFormState((prev) => ({
                      ...prev,
                      date: localDate,
                    }));
                  } else {
                    setFormState((prev) => ({ ...prev, date: "" }));
                  }
                }}
              dateFormat="yy-mm-dd"
              showIcon
              className="p-button-secondary"
              placeholder="Select a Issue Date"
              />
              <div>
                {errors.date && (
                  <small className="p-error">{errors.date}</small>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between my-1">
            <div className="col-2 field border-round">
              <InputText
                placeholder="Invoice Number"
                value={formState.invoiceNumber}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />
              {errors.invoiceNumber && (
                <small className="p-error">{errors.invoiceNumber}</small>
              )}
            </div>
            <div className="col-2 field ml-auto">
              <Calendar
                id="dueDate"
                value={formState.dueDate ? new Date(formState.dueDate) : undefined}
                onChange={(e) => {
                  if (e.value instanceof Date) {
                    const offset = e.value.getTimezoneOffset() * 60000;
                    const localDate = new Date(e.value.getTime() - offset)
                      .toISOString()
                      .split("T")[0];

                    setFormState((prev) => ({
                      ...prev,
                      dueDate: localDate,
                    }));
                  } else {
                    setFormState((prev) => ({ ...prev, dueDate: "" }));
                  }
                }}
                dateFormat="yy-mm-dd"
                showIcon
                className="p-button-secondary"
                placeholder="Select a Due Date"
              />
              {errors.dueDate && (
                <small className="p-error">{errors.dueDate}</small>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between my-1">
            <div className="col-2 field">
              <InputText
                placeholder="Reference"
                value={formState.reference}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, reference: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2 ml-auto justify-content-end mt-2 mb-4">
              <div className="field">
                <Dropdown
                  value={formState.lineAmountType}
                  options={amountOptions}
                  className="w-25rem"
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, lineAmountType: e.value }))
                  }
                />
              </div>

              <div className="field mr-2">
                <Dropdown
                  value={formState.currencyId}
                  options={currencies}
                  className="w-25rem"
                  optionLabel="currencies"
                  optionValue="id"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, currencyId: e.value }))
                  }
                  placeholder="Select a curruncy"
                />
                <div>
                  {errors.currencyId && (
                    <small className="p-error">{errors.currencyId}</small>
                  )}
                </div>
              </div>

              <div className="field">
                <Dropdown
                  value={formState.paymentType}
                  options={paymentTypes}
                  className="w-25rem"
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, paymentType: e.value }))
                  }
                  placeholder="Select Payment Method"
                  itemTemplate={paymentItemTemplate}
                  valueTemplate={paymentItemTemplate}
                />
              </div>
            </div>
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
          value={formState.invoiceItems}
          reorderableRows
          onRowReorder={handleRowReorder}
          showGridlines
          size="small"
        >
          <Column rowReorder />
            {fields.tableFields.item && (
              <Column header="Item" body={(rowData, opt) => (
                <Dropdown
                  value={rowData.itemId}
                  options={itemsList}
                  optionLabel="itemName"
                  optionValue="id"
                  onChange={(e) => handleItemChange(opt.rowIndex, e.value)}
                  placeholder="Select an item"
                  className="w-full border-none"
                  showClear
                />
              )} />
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
            className="p-button-text mb-2 mt-2"
            label="Add Item"
            icon="pi pi-plus"
          />
        </div>
        <div className="grid mb-3">
          <div className="col-8"></div>
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
      </div>
    </div>
  );
}