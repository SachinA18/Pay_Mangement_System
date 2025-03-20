import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { Toast } from "primereact/toast";

import ApiService from "../../services/api.service";
import { fixedAmount, getDate } from "../../helpers/template.helper";

interface JournalEntry {
  id: string;
  tenantId: string;
  narration: string;
  transactionDate: string;
  autoReversingDate: string | null;
  isDefaultNarrToJournalLineDesc: boolean;
  isShowJournalOnCashBasisReports: boolean;
  debitUSDSubTotal: number;
  debitUSDTaxTotal: number;
  debitUSDTotal: number;
  creditUSDSubTotal: number;
  creditUSDTaxTotal: number;
  creditUSDTotal: number;
  journalLineItems: JournalLineItem[] | null;
  isActive: boolean;
  created: string;
  createdBy: string;
  updated: string | null;
  updatedBy: string | null;
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

export default function Journals() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  const toast = useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("JournalEntry"), []);

  const tabItems = [
    { label: "All" },
    { label: "Active" },
    { label: "Inactive" },
  ];

  useEffect(() => {
    fetchJournals();
  }, [selectedTab]);

  const fetchJournals = async () => {
    try {
      const result = await apiService.get() as JournalEntry[];
      console.log("API Response:", result);
      if (Array.isArray(result)) {
        let filteredJournals = result.map(journal => {
          console.log("Processing journal:", journal);
          // Use the totals from the API response directly
          return {
            ...journal,
            debitUSDTotal: Number(journal.debitUSDTotal),
            creditUSDTotal: Number(journal.creditUSDTotal)
          };
        });
        
        if (selectedTab === "Active") {
          filteredJournals = filteredJournals.filter((j) => j.isActive);
        } else if (selectedTab === "Inactive") {
          filteredJournals = filteredJournals.filter((j) => !j.isActive);
        }
        console.log("Final journals:", filteredJournals);
        setJournals(filteredJournals);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load journal entries",
          life: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error fetching journals:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "An unexpected error occurred",
        life: 3000,
      });
    }
  };

  const handleDelete = async (journal: JournalEntry) => {
    try {
      await apiService.delete(journal.id);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Journal entry deleted successfully",
        life: 3000,
      });
      fetchJournals();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete journal entry",
        life: 3000,
      });
    }
  };

  const filteredJournals = journals.filter((journal) =>
    journal.narration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Manual Journals</h2>
          <p className="text-600">
            Create and manage manual journal entries for your accounting records.
          </p>
        </div>
        <Button
          label="New Journal Entry"
          icon="pi pi-plus"
          onClick={() => navigate("/accounting/manual-journal/00000000-0000-0000-0000-000000000000")}
          className="p-button-primary"
        />
      </div>

      <div className="p-card">
        <TabMenu
          model={tabItems}
          activeIndex={tabItems.findIndex((tab) => tab.label === selectedTab)}
          onTabChange={(e) => setSelectedTab(e.value.label || "All")}
        />

        <div className="mt-4 py-4">
          <div className="flex flex-wrap align-items-center gap-3 mb-4">
            <span className="p-input-icon-left w-20rem">
              <i className="pi pi-search" />
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journals..."
                className="w-full"
              />
            </span>
          </div>

          <div className="mt-2">
            {journals.length > 0 ? (
              <DataTable
                value={filteredJournals}
                className="p-datatable-sm text-sm"
                paginator
                rows={50}
                rowsPerPageOptions={[10, 25, 50]}
              >
                <Column
                  field="narration"
                  header="Narration"
                  sortable
                  filter
                />
                <Column
                  field="transactionDate"
                  header="Transaction Date"
                  sortable
                  filter
                  body={(rowData) => getDate(rowData.transactionDate)}
                />
                <Column
                  field="autoReversingDate"
                  header="Auto Reversing Date"
                  sortable
                  filter
                  body={(rowData) =>
                    rowData.autoReversingDate
                      ? getDate(rowData.autoReversingDate)
                      : ""
                  }
                />
                <Column
                  field="debitUSDTotal"
                  header="Total Debit"
                  sortable
                  filter
                  body={(rowData) => fixedAmount(rowData.debitUSDTotal)}
                  style={{ textAlign: "right" }}
                />
                <Column
                  field="creditUSDTotal"
                  header="Total Credit"
                  sortable
                  filter
                  body={(rowData) => fixedAmount(rowData.creditUSDTotal)}
                  style={{ textAlign: "right" }}
                />
                <Column
                  header="Actions"
                  body={(rowData) => (
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-raised p-button-rounded"
                      onClick={() =>
                        navigate(`/accounting/manual-journal/${rowData.id}`)
                      }
                    />
                  )}
                />
              </DataTable>
            ) : (
              <div className="flex flex-column align-items-center mt-4">
                <i className="pi pi-file text-xl"></i>
                <label className="mt-2 mb-4 text-lg">
                  No journal entries found.
                </label>
                <div>
                  <Button
                    label="Create Journal Entry"
                    onClick={() =>
                      navigate("/accounting/manual-journal/00000000-0000-0000-0000-000000000000")
                    }
                    className="p-button-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 