import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import ApiService from "../../services/api.service";
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiry?: string;
  serialNumber?: string;
  assetType: number;
  region?: number;
  description?: string;
  depreciationStartDate?: string;
  depreciationMethod?: number;
  averagingMethod?: number;
  depreciationCalculationMethod?: number;
  costLimit?: number;
  residualValue?: number;
  created: string;
  isActive: boolean;
}

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const apiService = useMemo(() => new ApiService("asset", false), []);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await apiService.get();
      setAssets(response as Asset[]);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const openSidebar = (asset: Asset | null) => {
    setSelectedAsset(asset);
    setVisible(true);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  const formatDateTime = (value: string | undefined) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
  };

  const getStatusTag = (isActive: boolean) => (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "info" : "danger"}
      rounded
    />
  );

  const assetActions = (rowData: Asset) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-sm"
      onClick={() => openSidebar(rowData)}
      rounded
      raised
    />
  );

  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(`asset/${id}`);
      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const handleAssetSaved = () => {
    setVisible(false);
    fetchAssets();
  };

  return (
    <div className="p-3 h-full">
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">Assets</div>
        <div className="text-color-secondary">
          Manage your company's fixed and current assets
        </div>
      </div>
      <Divider className="mb-1" />
      <div className="p-4 pt-6">
        <div className="flex justify-content-between align-items-center mb-4">
          <div className="flex gap-2">
            <Button
              label="Add Asset"
              icon="pi pi-plus"
              className="p-button-primary p-button-sm"
              onClick={() => openSidebar(null)}
            />
            <Button
              label="Export"
              icon="pi pi-download"
              className="p-button-text p-button-sm p-1 ml-3"
            />
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              className="p-button-text p-button-sm p-1"
              onClick={fetchAssets}
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Clear"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={clearSearch}
            />
            <InputText
              placeholder="Search Assets"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-inputtext-sm"
            />
          </div>
        </div>

        <DataTable
          value={assets}
          globalFilter={globalFilter}
          responsiveLayout="scroll"
          paginator
          rows={10}
          className="p-datatable-sm"
        >
          <Column
            field="isActive"
            header="Status"
            body={(rowData) => getStatusTag(rowData.isActive)}
            className="text-600"
          ></Column>
          <Column field="assetNumber" header="Code" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column 
            field="assetType" 
            header="Type" 
            sortable
            body={(rowData) => {
              const types = {0: 'Current', 1: 'Fixed', 2: 'Intangible'};
              return types[rowData.assetType as keyof typeof types] || '';
            }}
          ></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column 
            field="purchaseDate" 
            header="Created" 
            sortable
            body={(rowData) => formatDateTime(rowData.purchaseDate)}
          ></Column>
          <Column
            header="Actions"
            body={assetActions}
            className="text-600"
          ></Column>
        </DataTable>

        <Sidebar
          visible={visible}
          position="right"
          onHide={() => setVisible(false)}
          style={{ width: "40vw" }}
        >
          <AssetForm selectedAsset={selectedAsset} onAssetSaved={handleAssetSaved} />
        </Sidebar>
      </div>
    </div>
  );
};

interface AssetFormProps {
  selectedAsset?: Asset | null;
  onAssetSaved: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ selectedAsset, onAssetSaved }) => {
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<any>({
    id: selectedAsset?.id || "00000000-0000-0000-0000-000000000000",
    name: selectedAsset?.name || "",
    assetNumber: selectedAsset?.assetNumber || "",
    purchaseDate: formatDateForInput(selectedAsset?.purchaseDate),
    purchasePrice: selectedAsset?.purchasePrice || "",
    warrantyExpiry: formatDateForInput(selectedAsset?.warrantyExpiry),
    serialNumber: selectedAsset?.serialNumber || "",
    assetType: selectedAsset?.assetType || 0,
    region: selectedAsset?.region || null,
    description: selectedAsset?.description || "",
    depreciationStartDate: formatDateForInput(selectedAsset?.depreciationStartDate),
    depreciationMethod: selectedAsset?.depreciationMethod || null,
    averagingMethod: selectedAsset?.averagingMethod || null,
    depreciationCalculationMethod: selectedAsset?.depreciationCalculationMethod || null,
    costLimit: selectedAsset?.costLimit || "",
    residualValue: selectedAsset?.residualValue || "",
  });

  const apiService = useMemo(() => new ApiService("asset", false), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAsset) {
        await apiService.put(formData);
      } else {
        await apiService.post(formData);
      }
      onAssetSaved();
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  const handleDropdownChange = (e: DropdownChangeEvent, field: string) => {
    setFormData({ ...formData, [field]: e.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <h2>{selectedAsset ? "Edit Asset" : "Add Asset"}</h2>
      <div className="field">
        <label htmlFor="name">Name*</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="assetNumber">Asset Number*</label>
        <InputText
          id="assetNumber"
          value={formData.assetNumber}
          onChange={(e) => setFormData({ ...formData, assetNumber: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="purchaseDate">Purchase Date*</label>
        <InputText
          id="purchaseDate"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="purchasePrice">Purchase Price*</label>
        <InputText
          id="purchasePrice"
          type="number"
          value={formData.purchasePrice}
          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="warrantyExpiry">Warranty Expiry</label>
        <InputText
          id="warrantyExpiry"
          type="date"
          value={formData.warrantyExpiry}
          onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="serialNumber">Serial Number</label>
        <InputText
          id="serialNumber"
          value={formData.serialNumber}
          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="assetType">Asset Type*</label>
        <Dropdown
          id="assetType"
          value={formData.assetType}
          options={[
            { label: 'Current', value: 0 },
            { label: 'Fixed', value: 1 },
            { label: 'Intangible', value: 2 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'assetType')}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="region">Region</label>
        <Dropdown
          id="region"
          value={formData.region}
          options={[
            { label: 'Australia', value: 0 },
            { label: 'NewZealand', value: 1 },
            { label: 'Global', value: 2 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'region')}
        />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="field">
        <label htmlFor="depreciationStartDate">Depreciation Start Date</label>
        <InputText
          id="depreciationStartDate"
          type="date"
          value={formData.depreciationStartDate}
          onChange={(e) => setFormData({ ...formData, depreciationStartDate: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="depreciationMethod">Depreciation Method</label>
        <Dropdown
          id="depreciationMethod"
          value={formData.depreciationMethod}
          options={[
            { label: 'StraightLine', value: 0 },
            { label: 'DecliningBalance', value: 1 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'depreciationMethod')}
        />
      </div>
      <div className="field">
        <label htmlFor="averagingMethod">Averaging Method</label>
        <Dropdown
          id="averagingMethod"
          value={formData.averagingMethod}
          options={[
            { label: 'ActualDays', value: 0 },
            { label: 'FullMonth', value: 1 },
            { label: 'FullYear', value: 2 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'averagingMethod')}
        />
      </div>
      <div className="field">
        <label htmlFor="depreciationCalculationMethod">Depreciation Calculation Method</label>
        <Dropdown
          id="depreciationCalculationMethod"
          value={formData.depreciationCalculationMethod}
          options={[
            { label: 'NoDepreciation', value: 0 },
            { label: 'FixedAmount', value: 1 },
            { label: 'FixedPercentage', value: 2 }
          ]}
          onChange={(e) => handleDropdownChange(e, 'depreciationCalculationMethod')}
        />
      </div>
      <div className="field">
        <label htmlFor="costLimit">Cost Limit</label>
        <InputText
          id="costLimit"
          type="number"
          value={formData.costLimit}
          onChange={(e) => setFormData({ ...formData, costLimit: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="residualValue">Residual Value</label>
        <InputText
          id="residualValue"
          type="number"
          value={formData.residualValue}
          onChange={(e) => setFormData({ ...formData, residualValue: e.target.value })}
        />
      </div>
      <Button type="submit" label={selectedAsset ? "Update" : "Create"} className="mt-4" />
    </form>
  );
};

export default Assets; 