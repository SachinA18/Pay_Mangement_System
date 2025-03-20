import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const InventoryLayout: React.FC = () => {
  const location = useLocation();

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <div className="flex flex-column">
      <header className="surface-0 flex align-items-center justify-content-between mx-2">
        <BreadCrumb className="border-0" model={breadcrumbItems} />
        <nav className="flex gap-4">
          <Link
            to="/inventory/dashboard"
            className="text-blue-500 hover:text-blue-700 no-underline"
          >
            <i className="pi pi-home mr-2"></i> Dashboard
          </Link>
          <Link
            to="/inventory/stocks"
            className="text-blue-500 hover:text-blue-700 no-underline"
          >
            <i className="pi pi-database mr-2"></i> Stocks
          </Link>
          <Link
            to="/inventory/products"
            className="text-blue-500 hover:text-blue-700 no-underline"
          >
            <i className="pi pi-tags mr-2"></i> Products
          </Link>
          <Link
            to="/inventory/suppliers"
            className="text-blue-500 hover:text-blue-700 no-underline"
          >
            <i className="pi pi-users mr-2"></i> Suppliers
          </Link>
        </nav>
      </header>
      <main className="flex-grow-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

const getBreadcrumbItems = (path: string) => {
  const paths = path.split("/").filter((p) => p);
  const breadcrumbItems = [{ label: "Inventory", url: "/inventory/dashboard" }];

  if (paths.includes("dashboard")) {
    breadcrumbItems.push({ label: "Dashboard", url: "/inventory/dashboard" });
  } else if (paths.includes("stock")) {
    breadcrumbItems.push({ label: "Stocks", url: "/inventory/stocks" });
  } else if (paths.includes("products")) {
    breadcrumbItems.push({ label: "Products", url: "/inventory/products" });
  } else if (paths.includes("suppliers")) {
    breadcrumbItems.push({ label: "Suppliers", url: "/inventory/suppliers" });
  }

  return breadcrumbItems;
};

export default InventoryLayout;
