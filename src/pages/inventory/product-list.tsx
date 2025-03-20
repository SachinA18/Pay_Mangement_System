// src/pages/inventory/ProductList."

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Product A",
    sku: "SKU001",
    category: "Electronics",
    price: 100,
    stock: 50,
  },
  {
    id: 2,
    name: "Product B",
    sku: "SKU002",
    category: "Furniture",
    price: 200,
    stock: 30,
  },
  {
    id: 3,
    name: "Product C",
    sku: "SKU003",
    category: "Clothing",
    price: 50,
    stock: 100,
  },
  {
    id: 4,
    name: "Product D",
    sku: "SKU004",
    category: "Accessories",
    price: 75,
    stock: 20,
  },
  {
    id: 5,
    name: "Product E",
    sku: "SKU005",
    category: "Books",
    price: 25,
    stock: 80,
  },
  {
    id: 6,
    name: "Product F",
    sku: "SKU006",
    category: "Toys",
    price: 40,
    stock: 60,
  },
];

const ProductList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "details">("add");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const openSidebar = (mode: "add" | "edit" | "details", product?: Product) => {
    setFormMode(mode);
    setSelectedProduct(product || null);
    setVisible(true);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Add Product"
            icon="pi pi-plus"
            className="p-button-text p-button-primary p-button-sm"
            onClick={() => openSidebar("add")}
          />
          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-text p-button-primary p-button-sm"
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-text p-button-primary p-button-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            label="Clear"
            icon="pi pi-times"
            className="p-button-text p-button-primary p-button-sm"
            onClick={clearSearch}
          />
          <InputText
            placeholder="Search Products"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-inputtext-sm"
          />
        </div>
      </div>

      <DataTable
        value={products}
        globalFilter={globalFilter}
        responsiveLayout="scroll"
        className="p-datatable-sm text-sm"
        paginator
        rows={20}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="sku" header="SKU" sortable></Column>
        <Column field="category" header="Category" sortable></Column>
        <Column field="price" header="Price" sortable></Column>
        <Column field="stock" header="Stock" sortable></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-primary p-button-sm"
                onClick={() => openSidebar("edit", rowData)}
              />
              <Button
                icon="pi pi-eye"
                className="p-button-text p-button-primary p-button-sm"
                onClick={() => openSidebar("details", rowData)}
              />
            </div>
          )}
        ></Column>
      </DataTable>

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        className="w-30rem"
      >
        {formMode === "add" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Add Product</h3>
            <ProductForm />
          </div>
        )}
        {formMode === "edit" && selectedProduct && (
          <div>
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <ProductForm product={selectedProduct} />
          </div>
        )}
        {formMode === "details" && selectedProduct && (
          <div>
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <ProductDetails product={selectedProduct} />
          </div>
        )}
      </Sidebar>
    </div>
  );
};

interface ProductFormProps {
  product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  return (
    <form className="p-fluid">
      <div className="field mb-3">
        <label htmlFor="name">Product Name</label>
        <InputText
          id="name"
          defaultValue={product?.name || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="sku">SKU</label>
        <InputText
          id="sku"
          defaultValue={product?.sku || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="category">Category</label>
        <InputText
          id="category"
          defaultValue={product?.category || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="price">Price</label>
        <InputText
          id="price"
          type="number"
          defaultValue={product?.price || ""}
          className="p-inputtext-sm"
        />
      </div>
      <div className="field mb-3">
        <label htmlFor="stock">Stock</label>
        <InputText
          id="stock"
          type="number"
          defaultValue={product?.stock || ""}
          className="p-inputtext-sm"
        />
      </div>
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-primary p-button-sm"
      />
    </form>
  );
};

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="p-fluid">
      <div className="field mb-3">
        <label className="font-bold">Product Name:</label>
        <p>{product.name}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">SKU:</label>
        <p>{product.sku}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Category:</label>
        <p>{product.category}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Price:</label>
        <p>${product.price}</p>
      </div>
      <div className="field mb-3">
        <label className="font-bold">Stock:</label>
        <p>{product.stock}</p>
      </div>
    </div>
  );
};

export default ProductList;
