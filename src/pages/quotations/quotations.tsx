import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { TabMenu, TabMenuTabChangeEvent } from "primereact/tabmenu";
import { Toast } from "primereact/toast";

import ApiService from "../../services/api.service";

import { fixedAmount, getDate } from "../../helpers/template.helper";

import QuotationPreview from "./quotation-preview";

const Quotations = () => {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  const [selected, setSelected] = useState<any>({});
  const [dialog, setDialog] = useState(false);

  const toast = useRef<Toast>(null);

  const apiService = useMemo(() => new ApiService("Quote"), []);

  const tabItems = [
    { label: "All" },
    { label: "Drafts" },
    { label: "Sent" },
    { label: "Declined" },
    { label: "Accepted" },
    { label: "Invoiced" },
  ];

  const buttonItems = [
    { label: "New Credit Note", icon: "pi pi-credit-card" },
    { label: "Send Statement", icon: "pi pi-envelope" },
    { label: "Import", icon: "pi pi-upload" },
    { label: "Export", icon: "pi pi-download" },
  ];

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const breadcrumbItems = [{ label: "Quotations", url: "/quotations" }];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onTabChange = (e: TabMenuTabChangeEvent) => {
    setSelectedTab(e.value.label ?? "All");
  };

  const newQuotation = (): void => {
    navigate("/quotation-form/00000000-0000-0000-0000-000000000000");
  };

  useEffect(() => {
    fetchQuotation();
  }, []);

  const fetchQuotation = async () => {
    const result: any = await apiService.get();
    if (result.constructor === Array) {
      setQuotations(result);
    }
  };

  const handlePreview = async (quate: any) => {
    const result: any = await apiService.getById(quate.id);
    if (result.quoteModel) {
      setSelected(result);
      setDialog(true);
    }
  };

  const handleDelete = (quotation: any) => {};

    const filterQuotation = useMemo(() => {
      if (!searchQuery) {
        return quotations;
      }
    
      return quotations.filter((quotations) =>
        Object.values(quotations).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, [searchQuery, quotations]);

  return (
    <div className="flex flex-column h-screen">
      <div className="flex-grow-1 overflow-auto p-5">
        <Toast ref={toast}></Toast>
        <div className="flex justify-content-between align-items-start mb-4">
          <div>
            <BreadCrumb
              model={breadcrumbItems}
              home={breadcrumbHome}
              className="mb-3 text-700 bg-transparent border-none p-0"
            />
            <div className="text-600 text-3xl mt-4 mb-2 font-medium">
              Quotations
            </div>
            <div className="text-500">Create, Edit & Manage Quotations</div>
          </div>

          <SplitButton
            label="New Quotation"
            icon="pi pi-plus"
            onClick={newQuotation}
            model={buttonItems}
          />
        </div>
        <div className="p-card">
          <TabMenu
            model={tabItems}
            activeIndex={tabItems.findIndex((tab) => tab.label === selectedTab)}
            onTabChange={(e) => onTabChange(e)}
          />

          <div className="mt-4 py-4">
            <div className="flex flex-wrap align-items-center gap-3 mb-4">
              <span className="p-input-icon-left w-20rem">
                <InputText
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Global Search"
                  className="w-full"
                />
              </span>
            </div>
            <div className="mt-2 w-full">
              {quotations.length > 0 ? (
                <DataTable
                  value={filterQuotation}
                  className="p-datatable-sm text-sm w-full"
                  paginator
                  rows={50}
                >
                  <Column
                    field="created"
                    header="Created On"
                    body={(rowData) => getDate(rowData.created)}
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="quoteNumber"
                    header="Quotation #"
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="reference"
                    header="Reference #"
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="contactName"
                    header="Contact"
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="quoteDate"
                    header="Quotation Date"
                    body={(rowData) => getDate(rowData.quoteDate)}
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="expiryDate"
                    header="Expiry Date"
                    body={(rowData) => getDate(rowData.expiryDate)}
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="subTotal"
                    header="SubTotal"
                    className="text-right"
                    body={(rowData) => fixedAmount(rowData.subTotal)}
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="totalTax"
                    header="Total Tax"
                    className="text-right"
                    body={(rowData) => fixedAmount(rowData.totalTax)}
                    sortable
                    filter
                  ></Column>
                  <Column
                    field="total"
                    header="Total"
                    sortable
                    filter
                    className="text-right"
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
                            navigate(`/quotation-form/${rowData.id}`)
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
                    No Quotations here yet, create new Quotation.
                  </label>
                  <div>
                    <Button
                      label="New quotation"
                      onClick={newQuotation}
                      className="p-button-primary mr-2"
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
        {
          <QuotationPreview
            quote={selected.quoteModel}
            contact={selected.contactModel}
          />
        }
      </Dialog>
    </div>
  );
};

export default Quotations;
