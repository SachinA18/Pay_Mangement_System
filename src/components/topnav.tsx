import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const userMenu = useRef<Menu>(null);

  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const name = `${firstName} ${lastName}`.trim();
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const profilePicture =
    localStorage.getItem("profilePicture") ||
    "https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const menuItems = [
    {
      label: "SALES",
      icon: "pi pi-shopping-cart",
      items: [
        { label: "Sales Dashboard", command: () => navigate("/sales-dashboard") },
        { label: "Invoices", command: () => navigate("/invoices") },
        { label: "Quotes", command: () => navigate("/quotations") },
        { label: "Create New Invoice", command: () => navigate("/invoice-form/00000000-0000-0000-0000-000000000000") },
        { label: "Record Payment", command: () => navigate("/sales/payment/record") },
        { label: "Statements", command: () => navigate("/sales/statements") },
      ],
    },
    {
      label: "PURCHASING",
      icon: "pi pi-credit-card",
      items: [
        { label: "Purchasing Dashboard", command: () => navigate("/purchasing/dashboard") },
        { label: "Bills", command: () => navigate("/bills") },
        { label: "Purchase Orders", command: () => navigate("/purchasing/orders") },
        { label: "Create New Bill", command: () => navigate("/bill-form/00000000-0000-0000-0000-000000000000") },
        { label: "Record Bill Payment", command: () => navigate("/purchasing/payment/record") },
        { label: "Remittance", command: () => navigate("/purchasing/remittance") },
      ],
    },
    {
      label: "ACCOUNTING",
      icon: "pi pi-book",
      items: [
        { label: "Chart of Accounts", command: () => navigate("/accounting/chart-of-accounts") },
        { label: "Tax Codes & Rates", command: () => navigate("/accounting/tax-codes") },
        { label: "BAS & IAS Statements", command: () => navigate("/accounting/bas-ias-statements") },
      ],
    },
    {
      label: "BANKING",
      icon: "pi pi-wallet",
      items: [
        { label: "Bank Accounts", command: () => navigate("/banking/accounts") },
        { label: "Reconcile Accounts", command: () => navigate("/banking/reconcile") },
        { label: "Account Transactions", command: () => navigate("/banking/transactions") },
        { label: "Bank Statements", command: () => navigate("/banking/statements") },
        { label: "Spend Money", command: () => navigate("/banking/spend-money") },
        { label: "Receive Money", command: () => navigate("/banking/receive-money") },
        { label: "Transfer Money", command: () => navigate("/banking/transfer-money") },
      ],
    },
    {
      label: "PAYROLL",
      icon: "pi pi-users",
      items: [
        { label: "Employees", command: () => navigate("/payroll/employees") },
        { label: "Holidays & Leave", command: () => navigate("/payroll/holidays") },
        { label: "Timesheets", command: () => navigate("/payroll/timesheets") },
        { label: "Pay Employees", command: () => navigate("/payroll/pay") },
        { label: "Superannuation", command: () => navigate("/payroll/superannuation") },
        { label: "Single Touch Payroll", command: () => navigate("/payroll/stp") },
        { label: "Payroll Settings", command: () => navigate("/payroll/settings") },
      ],
    },
    {
      label: "REPORTS",
      icon: "pi pi-chart-line",
      items: [
        { label: "Aged Receivables", command: () => navigate("/reports/aged-receivables") },
        { label: "Aged Payables", command: () => navigate("/reports/aged-payables") },
        { label: "Profit & Loss", command: () => navigate("/reports/profit-loss") },
        { label: "Balance Sheet", command: () => navigate("/reports/balance-sheet") },
      ],
    },
    {
      label: "ADMIN",
      icon: "pi pi-cog",
      items: [
        { label: "Contacts", command: () => navigate("/contacts") },
        { label: "Users", command: () => navigate("/users") },
        { label: "Products & Services", command: () => navigate("/admin/products-services") },
        { label: "Organisation Details", command: () => navigate("/admin/organisation-details") },
        { label: "Invoice Settings", command: () => navigate("settings/invoices") },
        { label: "Bill Settings", command: () => navigate("/admin/bill-settings") },
        { label: "Payroll Settings", command: () => navigate("/admin/payroll-settings") },
        { label: "Payment Services", command: () => navigate("/admin/payment-services") },
      ],
    },
  ];

  const start = (
    <div
      className="flex align-items-center gap-2 mr-4 cursor-pointer"
      onClick={() => navigate("/dashboard")}
    >
      <div className="text-5xl text-primary font-semibold">CALSYS</div>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Button
        style={{ fontSize: "1.2rem", width: "3rem", height: "3rem" }}
        icon="pi pi-bell"
        className="bg-white c-border p-button-text text-gray-600 p-button-rounded"
        onClick={() => console.log("Notifications clicked")}
      />
      <Button
        style={{ fontSize: "1.2rem", width: "3rem", height: "3rem" }}
        icon="pi pi-user"
        className="bg-white c-border p-button p-button-rounded text-gray-600"
        onClick={(e) => userMenu.current?.toggle(e)}
      />
      <i className="pi pi-chevron-down ml-2"></i>
      <Menu
        model={[
          {
            template: () => (
              <div className="flex flex-column gap-2 p-2" style={{ width: "200px" }}>
                <img
                  src={profilePicture}
                  alt={name}
                  className="p-avatar p-avatar-circle"
                  style={{ width: "120px", height: "120px" }}
                />
                <div className="flex flex-column gap-1 my-2">
                  <span className="block font-bold text-gray-800">{name}</span>
                  <span className="block text-sm text-gray-600">{email}</span>
                  <span className="block text-sm text-gray-600">{role}</span>
                </div>
              </div>
            ),
          },
          { separator: true },
          { label: "Profile", icon: "pi pi-user", command: () => navigate("/user-profile") },
          { label: "Settings", icon: "pi pi-cog", command: () => navigate("settings/company") },
          { separator: true },
          { label: "Logout", icon: "pi pi-sign-out", command: () => navigate("/login") },
        ]}
        popup
        ref={userMenu}
        style={{ minWidth: "220px" }}
      />
    </div>
  );

  return <Menubar className="border-0 px-4 p-3 shadow" start={start} model={menuItems} end={end} />;
};

export default TopNav;