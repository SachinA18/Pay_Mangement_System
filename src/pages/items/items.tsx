import { useEffect, useMemo, useState } from "react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

import Item from "./item";
import ApiService from "../../services/api.service";

const Items = () => {
  const [items, setItems] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const apiService = useMemo(() => new ApiService("items"), []);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await apiService.get();
    if (Array.isArray(response)) {
      setItems(response);
    }
  };

  const openSidebar = (item: any) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const getStatusTag = (isActive: any) => (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "info" : "danger"}
      rounded
    />
  );

  const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

  const formatDateTime = (value: string) => {
    if (!value) return "";
    const dateObj = new Date(value);
    return dateObj.toLocaleString();
  };

  const itemActions = (rowData: any) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-sm"
      onClick={() => openSidebar(rowData)}
      rounded
      raised
    />
  );

  function clearSearch() {
    setGlobalFilter("");
  }

  const handlItemSaved = (e: any) => {
    setVisible(false);
    fetchItems();
  };

  return (
    <div className="p-3 h-full">
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">Items</div>
        <div className="text-color-secondary">
          Configure and manage all essential settings for your company
          operations.
        </div>
      </div>
      <Divider className="mb-1" />
      <div className="p-4 pt-6">
        <div className="flex justify-content-between align-items-center mb-4">
          <div className="flex gap-2">
            <Button
              label="Add Item"
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
              placeholder="Search Entries"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-inputtext-sm"
            />
          </div>
        </div>
        <DataTable
          value={items}
          className="p-datatable-sm"
          paginator
          rows={25}
          globalFilter={globalFilter}
        >
          <Column
            field="isActive"
            header="Status"
            body={(rowData) => getStatusTag(rowData.isActive)}
            className="text-600"
          ></Column>
          <Column
            field="code"
            header="Code"
            sortable
            className="text-600"
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            className="text-600"
          ></Column>
          <Column
            field="type"
            header="Type"
            sortable
            className="text-600"
          ></Column>
          <Column
            field="description"
            header="Description"
            sortable
            className="text-600"
          ></Column>

          <Column
            field="isTrackedAsInventory"
            header="Tracked as Inventory"
            sortable
            body={(rowData) => formatBoolean(rowData.isTrackedAsInventory)}
            className="text-600"
          ></Column>
          <Column
            field="isPurchased"
            header="Purchasing"
            sortable
            body={(rowData) => formatBoolean(rowData.isPurchased)}
            className="text-600"
          ></Column>
          <Column
            field="isSold"
            header="Selling"
            sortable
            body={(rowData) => formatBoolean(rowData.isSold)}
            className="text-600"
          ></Column>

          <Column
            field="created"
            header="Created"
            sortable
            body={(rowData) => formatDateTime(rowData.created)}
            className="text-600"
          ></Column>

          <Column
            header="Actions"
            body={itemActions}
            className="text-600"
          ></Column>
        </DataTable>
        <Sidebar
          visible={visible}
          position="right"
          onHide={() => setVisible(false)}
          style={{ width: "40vw" }}
        >
          <Item selectedItem={selectedItem} onItemSaved={handlItemSaved}></Item>
        </Sidebar>
      </div>
    </div>
  );
};

export default Items;
