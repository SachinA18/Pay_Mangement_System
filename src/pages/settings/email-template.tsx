import React, { useState, useEffect, useMemo } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";

import ApiService from "../../services/api.service";

const defaultTemplateData = {
  id: "00000000-0000-0000-0000-000000000000",
  tenantId: localStorage.getItem("tenantId"),
  emailSubject: "",
  emailBody: "",
  isActive: true,
};

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({ ...defaultTemplateData });
  const [errors, setErrors] = useState<any>({});

  const apiService = useMemo(() => new ApiService("EmailTemplateSettings"), []);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const response: any = await apiService.get();
    if (Array.isArray(response)) {
      setTemplates(response);
    }
  };

  const openEditSidebar = (template: any = null) => {
    setSelectedTemplate(template);
    setFormData(
      template
        ? {
            ...defaultTemplateData,
            emailSubject: template.emailSubject || "",
            emailBody: template.emailBody || "",
          }
        : { ...defaultTemplateData }
    );
    setErrors({});
    setVisible(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleBodyChange = (content: string) => {
    setFormData((prev) => ({ ...prev, emailBody: content }));
    setErrors((prev: any) => ({ ...prev, emailBody: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.emailSubject.trim())
      newErrors.emailSubject = "Subject is required.";
    if (!formData.emailBody.trim()) newErrors.emailBody = "Body is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveTemplate = async () => {
    if (!validateForm()) return;

    const response: any = selectedTemplate
      ? await apiService.put({ ...selectedTemplate, ...formData })
      : await apiService.post(formData);

    if (response.id) {
      setTemplates((prev) =>
        selectedTemplate
          ? prev.map((template) =>
              template.id === response.id ? response : template
            )
          : [...prev, response]
      );
      setVisible(false);
    }
  };

  const templateActions = (rowData: any) => (
    <Button
      label="Edit"
      icon="pi pi-pencil"
      className="p-button-text p-button-primary p-button-sm"
      onClick={() => openEditSidebar(rowData)}
    />
  );

  return (
    <div>
      <div className="text-xl font-semibold text-color mb-1">
        Email Templates
      </div>
      <div className="text-color-secondary">
        Add, edit, and manage your email templates.
      </div>
      <div className="flex justify-content-between align-items-center mb-4 mt-5">
        <div className="flex gap-2">
          <Button
            label="Add Template"
            icon="pi pi-plus"
            className="p-button-primary p-button-sm"
            onClick={() => openEditSidebar()}
          />
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            className="p-button-text p-button-sm"
            onClick={fetchTemplates}
          />
        </div>
      </div>

      <DataTable
        value={templates}
        className="p-datatable-sm text-sm"
        paginator
        rows={10}
      >
        <Column field="emailSubject" header="Template Name" sortable></Column>
        <Column header="Actions" body={templateActions}></Column>
      </DataTable>

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        style={{ width: "50rem" }}
      >
        <div className="mb-2 text-xl">
          {selectedTemplate
            ? selectedTemplate.emailSubject
            : "Add New Template"}
        </div>
        <div>
          <div className="p-fluid field mb-3">
            <label htmlFor="emailSubject">Template Name *</label>
            <InputText
              id="emailSubject"
              name="emailSubject"
              value={formData.emailSubject}
              onChange={handleInputChange}
              className="p-inputtext-sm"
            />
            {errors.emailSubject && (
              <small className="p-error">{errors.emailSubject}</small>
            )}
          </div>
          <div className="p-fluid field mb-3">
            <label htmlFor="emailBody">Body *</label>
            <Editor
              id="emailBody"
              value={formData.emailBody}
              onTextChange={(e) => handleBodyChange(e.htmlValue || "")}
              style={{ height: "200px" }}
            />
            {errors.emailBody && (
              <small className="p-error">{errors.emailBody}</small>
            )}
          </div>
          <div className="flex justify-end mt-3 gap-3">
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={saveTemplate}
            />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default EmailTemplates;
