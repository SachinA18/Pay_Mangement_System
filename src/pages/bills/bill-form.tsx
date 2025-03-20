import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { SplitButton } from "primereact/splitbutton";

import { fixedAmount } from "../../helpers/template.helper";

import ApiService from "../../services/api.service";
import {
  amountOptions,
  defaultGUID,
  defaultBill,
  defaultBillItem,
  errorState,
} from "./bill-defaults";

export default function BillForm() {
  const apiService = useMemo(() => new ApiService("bill"), []);
  const contactService = useMemo(() => new ApiService("contacts"), []);
  const currencyService = useMemo(() => new ApiService("CurrencySettings"), []);
  const itemService = useMemo(() => new ApiService("Items"), []);

  const { id } = useParams();

  const toast = useRef<Toast>(null);

  const [contacts, setContacts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [showTextarea, setShowTextarea] = useState(false);
  const [note, setNote] = useState("");
  const textareaRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({ ...defaultBill });
  const [errors, setErrors] = useState({ ...errorState });
  const [, setSavedNotes] = useState<string[]>([]);

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [
    { label: "Bills", url: "/bills" },
    { label: "New Bill" },
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
        return apiService.getById(id).then((billRes) => {
          if (billRes) {
            setFormState(() => ({
              ...defaultBill,
              ...billRes,
            }));
            setErrors({ ...errorState });
          }
        });
      }
    });
  };

  const subtotal = formState.billItems.reduce(
    (sum: any, i: any) => sum + i.qty * i.price,
    0
  );

  const totalTax = formState.billItems.reduce(
    (sum: any, i: any) => sum + (i.qty * i.price * i.taxRate) / 100,
    0
  );

  const total = formState.lineAmountType === 2 ? subtotal + totalTax : subtotal;

  const handleItemChange = (rowIndex: number, value: string) => {
    const found = itemsList.find((p) => p.id === value);
    setFormState((prev) => ({
      ...prev,
      billItems: prev.billItems.map((item: any, idx: any) =>
        idx === rowIndex && found
          ? {
              ...item,
              item: found.id,
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
      billItems: prev.billItems.map((item: any, idx: any) =>
        idx === rowIndex ? { ...item, qty: value } : item
      ),
    }));
  };

  const addNewRow = () => {
    setFormState((prev) => ({
      ...prev,
      billItems: [...prev.billItems, { ...defaultBillItem }],
    }));
  };

  const addNewFive = () => {
    setFormState((prev) => ({
      ...prev,
      billItems: [
        ...prev.billItems,
        ...Array.from({ length: 5 }, () => ({ ...defaultBillItem })),
      ],
    }));
  };

  const addNewTen = () => {
    setFormState((prev) => ({
      ...prev,
      billItems: [
        ...prev.billItems,
        ...Array.from({ length: 10 }, () => ({ ...defaultBillItem })),
      ],
    }));
  };

  const addNewTwenty = () => {
    setFormState((prev) => ({
      ...prev,
      billItems: [
        ...prev.billItems,
        ...Array.from({ length: 20 }, () => ({ ...defaultBillItem })),
      ],
    }));
  };

  const deleteRow = (rowIndex: number) => {
    setFormState((prev) => ({
      ...prev,
      billItems: prev.billItems.filter((_, idx: any) => idx !== rowIndex),
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
      e.date = "Bill date is required.";
      valid = false;
    }

    if (!formState.dueDate) {
      e.dueDate = "Due date is required.";
      valid = false;
    } else if (new Date(formState.date) > new Date(formState.dueDate)) {
      e.dueDate = "Due date must be later than the bill date.";
      valid = false;
    }

    if (!formState.billNumber.trim()) {
      e.billNumber = "Bill number is required.";
      valid = false;
    }

    if (formState.billItems.some((itm: any) => !itm.item || itm.qty <= 0)) {
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

    let response: any;
    if (formState.id === defaultGUID) {
      response = await apiService.post(formState);
    } else {
      response = await apiService.put(formState);
    }
    if (response?.id) {
      toast.current?.show({
        severity: "success",
        summary: action === "save" ? "Bill Saved" : "Bill Approved",
        detail:
          action === "save"
            ? "Bill saved successfully"
            : "Bill approved and emailed successfully",
      });
    }
  };

  const handleClose = () => {
    handleSubmit("save");
  };

  const handleSave = () => {
    handleSubmit("save");
  };

  const handleApprove = () => {
    handleSubmit("approve");
  };

  const handleRowReorder = (event: any) => {
    setFormState((prev) => ({
      ...prev,
      billItems: event.value,
    }));
  };

  const onUpload = () => {
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const handleAddNoteClick = () => {
    setShowTextarea((prev) => !prev);
  };

  useEffect(() => {
    if (showTextarea && textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTextarea]);

  const handleNoteSave = () => {
    if (note.trim()) {
      setSavedNotes((prev) => [...prev, note]);
      setNote("");
      setShowTextarea(false);
    }
    
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Note Saved",
    });
  };

  const handleNoteCancel = () => {
    setNote("");
    setShowTextarea(false);
  };

  return (
    <div className="p-card m-3 p-4">
      <Toast ref={toast} />
      <BreadCrumb
        model={breadcrumbItems}
        home={breadcrumbHome}
        className="mb-3 text-700 bg-transparent border-none p-0"
      />
      <div className="text-600 text-3xl my-4 font-medium">Create New Bill</div>
      <p className="text-600">
        Accordions condense information visually <br /> and limit the display of
        information to one kind at a time by default.
      </p>
      <div className="grid mb-3 mt-4 p-fluid">
        <div className="col-3 field">
          <label className="text-600">From</label>
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
        <div className="col-3 field">
          <label className="text-600">Date</label>
          <Calendar
            value={formState.date ? new Date(formState.date) : undefined}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                date:
                  e.value instanceof Date
                    ? new Date(e.value.getTime() - e.value.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0]
                    : "",
              }))
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="p-button-secondary"
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
        </div>
        <div className="col-3 field">
          <label htmlFor="dueDate" className="text-600">
            Expiry date
          </label>
          <Calendar
            id="dueDate"
            value={formState.dueDate ? new Date(formState.dueDate) : undefined}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                dueDate:
                  e.value instanceof Date
                    ? new Date(e.value.getTime() - e.value.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0]
                    : "",
              }))
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="p-button-secondary"
          />
          {errors.dueDate && (
            <small className="p-error">{errors.dueDate}</small>
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
      </div>

      <div className="mb-4">
        <DataTable
          value={formState.billItems}
          reorderableRows
          onRowReorder={handleRowReorder}
          showGridlines
          size="small"
        >
          <Column rowReorder />
          <Column
            header="Item"
            body={(rowData, opt) => (
              <Dropdown
                value={rowData.item}
                options={itemsList.map((p: any) => ({
                  label: p.name,
                  value: p.id,
                }))}
                onChange={(e) => handleItemChange(opt.rowIndex, e.value)}
                placeholder="Select an item"
                className="w-full border-none"
                showClear
              />
            )}
          />
          <Column header="Description" field="description" />
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
          <Column
            header="Price"
            body={(rowData) => fixedAmount(rowData.price)}
          />
          <Column header="Tax Rate (%)" field="taxRate" />
          <Column
            header="Amount"
            body={(rowData) => fixedAmount(rowData.qty * rowData.price)}
          />
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
        <SplitButton
          label="Add Item"
          icon="pi pi-plus"
          className="p-button-text mt-2"
          onClick={addNewRow}
          model={[
            { label: "Add 5 rows", command: addNewFive },
            { label: "Add 10 rows", command: addNewTen },
            { label: "Add 20 rows", command: addNewTwenty },
          ]}
        />
      </div>
      <div className="grid mb-3 align-items-start justify-content-between">
        <div className="col-6">
          <div className="flex justify-content-start mt-4">
            <FileUpload
              mode="basic"
              name="demo[]"
              url="/api/upload"
              maxFileSize={1000000}
              onUpload={onUpload}
              auto
              chooseLabel="Upload Files"
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

      <div className="flex justify-content-between gap-2 mt-4">
        <SplitButton
          label="Save"
          icon="pi pi-save"
          onClick={handleSave}
          model={[
            { label: "Save as draft", command: handleSave },
            { label: "Save (continue editing)", command: handleSave },
            { label: "Save and submit for approval", command: handleSave },
            { label: "Save and add another", command: handleSave },
          ]}
        />

        <div className="flex gap-2">
          <SplitButton
            label="Approve"
            icon="pi pi-check"
            onClick={handleApprove}
            model={[
              { label: "Approve", command: handleApprove },
              { label: "Approve and add another", command: handleApprove },
            ]}
          />
          <Button
            onClick={handleClose}
            className="p-button-outlined"
            label="Cancel"
          />
        </div>
      </div>

      <div className="mt-6 text-600 ml-1">
        <label>History & Notes</label>
      </div>
      <div className="mt-3">
        <Button
          label={showTextarea ? "Hide Note" : "Add Note"}
          outlined
          onClick={handleAddNoteClick}
        />
      </div>
      {showTextarea && (
        <div className="card mt-3" ref={textareaRef}>
          <InputTextarea
            placeholder="Note: "
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            cols={30}
          />
          <div className="mt-2">
            <Button
              label="Save"
              className="mr-2"
              icon="pi pi-save"
              onClick={handleNoteSave} />
            <Button
              label="Cancel"
              className="p-button-secondary"
              onClick={handleNoteCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
