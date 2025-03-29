import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Layout from "./layout";
import Journals from "./pages/accounting/journals";
import ManualJournal from "./pages/accounting/manual-journal";
import Contacts from "./pages/contacts/contacts";
import Dashboard from "./pages/dashboard";
import Assets from "./pages/general-ledger/assets";
import AuditTrail from "./pages/general-ledger/audit-trail";
import BalanceSheet from "./pages/general-ledger/balance-sheet";
import ChartOfAccounts from "./pages/general-ledger/chart-of-accounts";
import GeneralLedgerDashboard from "./pages/general-ledger/general-ledger-dashboard";
import GeneralLedgerLayout from "./pages/general-ledger/general-ledger-layout";
import IncomeStatement from "./pages/general-ledger/income-statement";
import JournalEntries from "./pages/general-ledger/journal-entries";
import TrialBalance from "./pages/general-ledger/trial-balance";
import InventoryDashboard from "./pages/inventory/inventory-dashboard";
import InventoryLayout from "./pages/inventory/inventory-layout";
import ProductList from "./pages/inventory/product-list";
import StockList from "./pages/inventory/stock-list";
import SupplierList from "./pages/inventory/supplier-list";
import InvoiceForm from "./pages/invoice/invoice-form";
import Invoices from "./pages/invoice/invoices";
import Items from "./pages/items/items";
import QuotationForm from "./pages/quotations/quotation-form";
import Quotations from "./pages/quotations/quotations";
import ForgotPassword from "./pages/sign/forgot-password";
import LoginPage from "./pages/sign/login";
import SignUpPage from "./pages/sign/signup";
import UserProfile from "./pages/user-profile";
import Users from "./pages/users";
import SettingsRoutes from "./routes/settings.routes";
import Bills from "./pages/bills/bill";
import BillForm from "./pages/bills/bill-form";
import InvoicePreview from "./pages/invoice/invoice-preview";
import SalesDashboard from "./pages/sales/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Layout />}>
          <Route path="settings/*" element={<SettingsRoutes />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory/*" element={<InventoryLayout />}>
            <Route path="dashboard" element={<InventoryDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="stocks" element={<StockList />} />
          </Route>
          <Route path="general-ledger/*" element={<GeneralLedgerLayout />}>
            <Route path="dashboard" element={<GeneralLedgerDashboard />} />
            <Route path="journal-entries" element={<JournalEntries />} />
            <Route path="trial-balance" element={<TrialBalance />} />
            <Route path="balance-sheet" element={<BalanceSheet />} />
            <Route path="income-statement" element={<IncomeStatement />} />
            <Route path="audit-trail" element={<AuditTrail />} />
          </Route>
          <Route
            path="accounting/chart-of-accounts"
            element={<ChartOfAccounts />}
          />
          <Route path="accounting/assets" element={<Assets />} />
          <Route path="accounting/journals" element={<Journals />} />
          <Route
            path="accounting/manual-journal/:id"
            element={<ManualJournal />}
          />
          <Route path="contacts" element={<Contacts />} />
          <Route path="items" element={<Items />} />
          <Route path="users" element={<Users />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoice-preview" element={<InvoicePreview />} />
          <Route path="invoice-form/:id" element={<InvoiceForm />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="quotation-form/:id" element={<QuotationForm />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bill-form/:id" element={<BillForm />} />
          <Route path="sales-dashboard" element={<SalesDashboard />} />
        </Route>
        <Route path="/" element={<Navigate to="dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
