// src/pages/inventory/InventoryDashboard."

import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primeflex/primeflex.css";
import ApiService from "../../services/api.service";

interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStock: number;
  totalSuppliers: number;
  stockTrends: {
    labels: string[];
    data: number[];
  };
  stockDistribution: {
    labels: string[];
    data: number[];
  };
  recentTransactions: any[];
  message?: string;
}

const InventoryDashboard: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStock: 0,
    totalSuppliers: 0,
    stockTrends: {
      labels: [],
      data: []
    },
    stockDistribution: {
      labels: [],
      data: []
    },
    recentTransactions: []
  });

  const apiService = new ApiService("inventory/dashboard");

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.get() as (InventoryStats & { message?: string });
      
      if (response && 'totalProducts' in response) {
        setStats(response);
      } else {
        let errorMessage = 'Failed to load inventory statistics. Please try again.';
        if (response?.message) {
          errorMessage = response.message;
        }
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
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
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchInventoryStats();
    toast.current?.show({
      severity: 'info',
      summary: 'Refreshing',
      detail: 'Inventory statistics are being updated...',
      life: 2000
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-3">
        <h2 className="text-xl font-bold">Inventory Dashboard</h2>
        <Button 
          icon="pi pi-refresh" 
          className="p-button-text" 
          onClick={handleRefresh}
          loading={loading}
        />
      </div>

      <div className="grid grid-nogutter mb-5">
        <div className="col-12 md:col-3 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-2">Total Products</h2>
            <p className="text-2xl text-blue-500">{stats.totalProducts}</p>
          </Card>
        </div>
        <div className="col-12 md:col-3 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-2">Low Stock Items</h2>
            <p className="text-2xl text-red-500">{stats.lowStockItems}</p>
          </Card>
        </div>
        <div className="col-12 md:col-3 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-2">Out of Stock</h2>
            <p className="text-2xl text-orange-500">{stats.outOfStock}</p>
          </Card>
        </div>
        <div className="col-12 md:col-3 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-2">Total Suppliers</h2>
            <p className="text-2xl text-green-500">{stats.totalSuppliers}</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-nogutter mb-5">
        <div className="col-12 md:col-7 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-3">Stock Trends</h2>
            <Chart 
              type="line" 
              data={{
                labels: stats.stockTrends.labels,
                datasets: [{
                  label: "Stock Levels",
                  data: stats.stockTrends.data,
                  fill: false,
                  borderColor: "#42A5F5",
                  tension: 0.4
                }]
              }}
              style={{ height: "300px" }}
            />
          </Card>
        </div>
        <div className="col-12 md:col-5 p-2">
          <Card className="shadow-2">
            <h2 className="text-xl font-bold mb-3">Stock Distribution</h2>
            <Chart 
              type="pie"
              data={{
                labels: stats.stockDistribution.labels,
                datasets: [{
                  data: stats.stockDistribution.data,
                  backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF"
                  ]
                }]
              }}
              options={{ maintainAspectRatio: false }}
              style={{ width: "100%", height: "300px" }}
            />
          </Card>
        </div>
      </div>

      <div className="p-2">
        <Card className="shadow-2">
          <div className="flex justify-content-between align-items-center mb-3">
            <h2 className="text-xl font-bold">Recent Stock Transactions</h2>
          </div>
          <DataTable 
            value={stats.recentTransactions} 
            responsiveLayout="scroll"
            loading={loading}
          >
            <Column field="date" header="Date"></Column>
            <Column field="product" header="Product"></Column>
            <Column field="quantity" header="Quantity"></Column>
            <Column field="type" header="Type"></Column>
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
