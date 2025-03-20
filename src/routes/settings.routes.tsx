import React from "react";
import { Routes, Route } from "react-router-dom";

import SettingsLayout from "../pages/settings/settings-layout";
import CompanySettings from "../pages/settings/company";
import CurrencySettings from "../pages/settings/currencies";
import DefaultSettings from "../pages/settings/default";
import EmailTemplateSettings from "../pages/settings/email-template";
import InvoiceSettings from "../pages/settings/invoices";
import LocalizationSettings from "../pages/settings/localization";
import SchedulingSettings from "../pages/settings/scheduling";
import TaxSettings from "../pages/settings/taxes";

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsLayout />}>
        <Route path="company" element={<CompanySettings />} />
        <Route path="currencies" element={<CurrencySettings />} />
        <Route path="default" element={<DefaultSettings />} />
        <Route path="email-template" element={<EmailTemplateSettings />} />
        <Route path="invoices" element={<InvoiceSettings />} />
        <Route path="localization" element={<LocalizationSettings />} />
        <Route path="scheduling" element={<SchedulingSettings />} />
        <Route path="taxes" element={<TaxSettings />} />
      </Route>
    </Routes>
  );
};

export default SettingsRoutes;
