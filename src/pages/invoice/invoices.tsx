import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { BreadCrumb } from "primereact/breadcrumb";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import ApiService from "../../services/api.service";

import { fixedAmount, getDate } from "../../helpers/template.helper";

const defaultColumns = {
  view: false,
  form: false,
  status: false,
  references: false,
  date: false,
  dueDate: false,
  paid: false,
  due: false,
  curruncy: false,
  files: false,
  credited: false,
  paidDate: false,
  Total: false,
};

const Invoices = () => {
  const navigate = useNavigate();
  const [importDialog, setImportDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selected, setSelected] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  const toast = useRef<Toast>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const apiService = useMemo(() => new ApiService("Invoice"), []);

  const tabs = ["All", "Drafts", "Awaiting Approval", "Awaiting Payment", "Paid", "Repeat"];

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [{ label: "Invoices", url: "/invoices" }];
    
  const buttonItems = [
    {
      label: "New Invoice",
      icon: "pi pi-plus",
      command: () => navigate("/invoice-form/00000000-0000-0000-0000-000000000000"),
    },
    { 
      label: "Send Statement", 
      icon: "pi pi-envelope",
    },
    { 
      label: "Import", 
      icon: "pi pi-upload", 
      command: () => setImportDialog(true),
    },
  ];

  const onFileUpload = (event: any) => {
    console.log("Uploaded Files:", event.files);
    setImportDialog(false);
  };

  const [filters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoiceNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    reference: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    dueDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
    total: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
  });

  const newInvoice = (): void => {
    navigate("/invoice-form/00000000-0000-0000-0000-000000000000");
  };

  const handleBack = (): void => {
    navigate("/");
  }

  useEffect(() => {
    fetchInvoice();
  }, []);


  const fetchInvoice = async () => {
    const result: any = await apiService.get();

    if (result.constructor === Array) {
      setInvoices(result);
    }
  };

  const handleDelete = (invoice: any) => { };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePreview = async (invoice: any) => {
    const result: any = await apiService.getById(invoice.id);
    if (result.invoiceModel) {
        setSelected(result);
        setDialog(true);
    }
  };

  const filterInvoices = useMemo(() => {
    if (!searchQuery) {
      return invoices;
    }
  
    return (invoices || []).filter((invoice) =>
      Object.values(invoice).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, invoices]);

  return (
    <div className="flex flex-column h-screen surface-0">
      <div className="flex-grow-1 overflow-auto p-5">
        <Toast ref={toast}></Toast>
        <div className="flex justify-content-between align-items-start mb-4">
          <BreadCrumb
            model={breadcrumbItems}
            home={breadcrumbHome}
            className="mb-3 text-700 bg-transparent border-none p-0"
          />
          <div className="flex mb-4 justify-content-end gap-2">
            <Button
              label="Back"
              onClick={handleBack}
              className="p-button-outlined w-12rem"
            />
          <SplitButton
            label="New Invoice"
            icon="pi pi-plus"
            onClick={newInvoice}
            model={buttonItems}
          />
            <Dialog
              visible={importDialog}
              onHide={() => setImportDialog(false)}
              header="Import File Your File"
              draggable={false}
            >
              <div className="flex flex-column align-items-center gap-3 mt-3">
                <FileUpload
                  mode="basic"
                  name="file"
                  accept=".csv,.xlsx"
                  customUpload
                  auto
                  chooseLabel="Select File"
                  onSelect={onFileUpload}
                />
              </div>
            </Dialog>
          </div>
        </div>
        <div className="text-600 text-3xl mb-4 font-medium">Invoices</div>
        <div className="flex gap-2 justify-content-end mr-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              label={tab}
              className={`p-button-text w-12rem ${selectedTab === tab ? "bg-blue-200 text-gray-800" : "text-gray-800 bg-gray-200"}`}
              onClick={() => setSelectedTab(tab)}
            />
          ))}
        </div>
        <div className="card shadow-3 p-3 surface-0">
          <div className="flex flex-wrap align-items-center gap-3 mb-4">
          <span className="p-input-icon-left w-20rem">
            <InputText
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Global Search"
              className="w-full border-round"
            />
          </span>
        </div>
          <div className="mt-4 py-4">
            <div className="w-full">
              {invoices.length > 0 ? (
                <DataTable
                  value={filterInvoices}
                  className="p-datatable-sm text-sm w-full"
                  paginator
                  rows={50}
                  filters={showFilters ? filters : {}}
                >
                  <Column
                    field="invoiceNumber"
                    header="Invoice #"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                  ></Column>
                  <Column
                    field="reference"
                    header="Reference #"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                  ></Column>
                  <Column
                    field="contactName"
                    header="Customer"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                  ></Column>
                  <Column
                    field="date"
                    header="Invoice Date"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                    body={(rowData) => getDate(rowData.date)}
                  ></Column>
                  <Column
                    field="dueDate"
                    header="Due Date"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                    body={(rowData) => getDate(rowData.dueDate)}
                  ></Column>
                  <Column
                    field="amountTypeName"
                    header="Line Amount Type"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                  ></Column>
                  <Column
                    field="paymentTypeName"
                    header="Payment Method"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                  ></Column>
                  <Column
                    field="total"
                    header="Total"
                    sortable filter={showFilters}
                    showFilterMenu={showFilters}
                    body={(rowData) => fixedAmount(rowData.total)}
                  ></Column>
                  <Column
                    header="Actions"
                    body={(rowData) => (
                      <div className="flex gap-2">
                        <Button
                          icon="pi pi-pencil"
                          text
                          onClick={() =>
                            navigate(`/invoice-form/${rowData.id}`)
                          }
                          tooltip="Edit"
                        />
                        <Button
                          icon="pi pi-eye"
                          text
                          severity="info"
                          tooltip="Preview"
                          onClick={() => handlePreview(rowData)}
                        />
                        <Button
                          icon="pi pi-trash"
                          text
                          severity="danger"
                          tooltip="Delete"
                          onClick={() => handleDelete(rowData)}
                        />
                      </div>
                    )}
                  ></Column>
                </DataTable>
              ) : (
                <div className="flex flex-column align-items-center mt-4">
                  <i className="pi pi-file text-xl"></i>
                  <label className="mt-2 mb-4 text-lg">
                    No Invoices here yet, create new Invoice.
                  </label>
                  <div>
                    <Button
                      label="New invoice"
                      onClick={newInvoice}
                      className="mr-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        visible={dialog}
        style={{ width: "70vw" }}
        onHide={() => {
          setDialog(false);
        }}
      >
      </Dialog>
    </div>
  );
};

export default Invoices;