import { useState, useRef, useMemo, useEffect, FormEvent, FC } from "react";

import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import ApiService from "../../services/api.service";

const defaultGUID = "00000000-0000-0000-0000-000000000000";

const defaultFormData: any = {
  id: defaultGUID,
  tenantId: localStorage.getItem("tenantId"),
  code: "",
  name: "",
  description: "",
  type: 0,
  isTrackedAsInventory: false,
  isPurchased: false,
  isSold: false,
  inventoryAssetAccountCode: null,
  costPrice: null,
  purchaseAccountId: null,
  purchaseTaxRateId: defaultGUID,
  purchaseDescription: "",
  salePrice: null,
  salesAccountId: null,
  salesTaxRateId: defaultGUID,
  salesDescription: "",
  isActive: true,
};

interface ItemFormProps {
  onItemSaved?: (savedItem: any) => void;
  selectedItem?: any;
}

const ItemForm: FC<ItemFormProps> = ({ onItemSaved, selectedItem }) => {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState<any>({});
  const toast = useRef<Toast>(null);

  const apiService = useMemo(() => new ApiService("items"), []);

  const accounts = [
    {
      label: "630 - Inventory",
      value: "00000000-0000-0000-0000-000000000001",
    },
    {
      label: "Cost of Goods Sold",
      value: "00000000-0000-0000-0000-000000000002",
    },
    { label: "Sales", value: "00000000-0000-0000-0000-000000000003" },
  ];

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    } else {
      setFormData({ ...defaultFormData });
    }
  }, [selectedItem]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please check the form for errors and try again.',
        life: 3000
      });
      return;
    }

    try {
      let response: { id?: string; message?: string; status?: number };
      console.log('Making API call with data:', formData);
      
      if (formData.id === defaultGUID) {
        try {
          const rawResponse = await apiService.post(formData);
          console.log('Raw API Response:', rawResponse);
          response = rawResponse as { id?: string; message?: string; status?: number };
        } catch (apiError: any) {
          console.log('API Error:', apiError);
          console.log('API Error Response:', apiError.response);
          console.log('API Error Response Data:', apiError.response?.data);
          throw apiError;
        }
      } else {
        response = await apiService.put(formData) as { id?: string; message?: string; status?: number };
      }

      console.log('Processed response:', response);

      if (response && response.id) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: `Item ${formData.id === defaultGUID ? 'created' : 'updated'} successfully.`,
          life: 3000
        });

        if (onItemSaved) {
          onItemSaved(response);
        }
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save item. Please try again.',
          life: 3000
        });
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Simply use the error message from the response if available
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
    }
  };

  const validateForm = () => {
    const formErrors: any = {};

    if (!formData.code) formErrors.code = "Code is required";
    if (!formData.name) formErrors.name = "Name is required";
    if (formData.isTrackedAsInventory && !formData.inventoryAssetAccountCode) {
      formErrors.inventoryAssetAccountCode = "Inventory Account is required";
    }
    if (formData.isPurchased && !formData.costPrice) {
      formErrors.costPrice = "Cost price is required";
    }
    if (formData.isPurchased && !formData.purchaseAccountId) {
      formErrors.purchaseAccountId = "Cost of Goods Sold account is required";
    }
    if (formData.isPurchased && !formData.purchaseTaxRateId) {
      formErrors.purchaseTaxRateId = "Tax rate is required";
    }
    if (formData.isSold && !formData.salePrice) {
      formErrors.salePrice = "Sale price is required";
    }
    if (formData.isSold && !formData.salesAccountId) {
      formErrors.salesAccountId = "Sales account is required";
    }
    if (formData.isSold && !formData.salesTaxRateId) {
      formErrors.salesTaxRateId = "Sales tax rate is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="mb-2 text-xl">
        {formData.id !== defaultGUID ? "Edit Item" : "Add Item"}
      </div>
      {formData.id !== defaultGUID && (
        <div className="text-sm">ID: {formData.id}</div>
      )}
      <Divider />
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className="p-fluid grid mt-3">
          <div className="col-6 field">
            <label htmlFor="code">Code (required)</label>
            <InputText
              placeholder="Code"
              value={formData.code}
              className="p-inputtext-sm"
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
            {errors.code && <small className="p-error">{errors.code}</small>}
          </div>

          <div className="col-6 field">
            <label htmlFor="name">Name (required)</label>
            <InputText
              placeholder="Name"
              value={formData.name}
              className="p-inputtext-sm"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>

          <div className="col-12 field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              rows={3}
              placeholder="Description"
              className="p-inputtext-sm"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="col-12 pt-3">
            <Checkbox
              id="trackInventory"
              checked={formData.isTrackedAsInventory}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  isTrackedAsInventory: e.checked ?? false,
                }))
              }
            />
            <label htmlFor="trackInventory" className="ml-2">
              Track inventory item
            </label>
          </div>

          {formData.isTrackedAsInventory && (
            <p className="text-sm text-600 mt-3">
              Track the quantity and value of stock on hand.
            </p>
          )}

          {formData.isTrackedAsInventory && (
            <div className="col-12 flex flex-column gap-2">
              <label
                htmlFor="inventoryAssetAccountCode"
                className="font-medium"
              >
                Inventory Asset account (required)
              </label>
              <Dropdown
                id="inventoryAssetAccountCode"
                className="w-full"
                options={accounts}
                value={formData.inventoryAssetAccountCode}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    inventoryAssetAccountCode: e.value,
                  }))
                }
                placeholder="Select account"
              />
              {errors.inventoryAssetAccountCode && (
                <small className="p-error">
                  {errors.inventoryAssetAccountCode}
                </small>
              )}
            </div>
          )}

          <div className="col-12 mt-4 mb-3">
            <Checkbox
              id="purchase"
              checked={formData.isPurchased}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  isPurchased: e.checked ?? false,
                }))
              }
            />
            <label htmlFor="purchase" className="ml-2">
              Purchase
            </label>
          </div>

          {formData.isPurchased && (
            <>
              <div className="col-6 field">
                <label htmlFor="costPrice" className="font-medium">
                  Cost price (required)
                </label>
                <InputText
                  id="costPrice"
                  className="w-full"
                  placeholder="Cost price"
                  value={formData.costPrice || ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      costPrice: e.target.value,
                    }))
                  }
                />
                {errors.costPrice && (
                  <small className="p-error">{errors.costPrice}</small>
                )}
              </div>

              <div className="col-6 field">
                <label htmlFor="purchaseAccountId" className="font-medium">
                  Cost of Goods Sold account (required)
                </label>
                <Dropdown
                  id="purchaseAccountId"
                  className="w-full"
                  options={accounts}
                  value={formData.purchaseAccountId}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      purchaseAccountId: e.value,
                    }))
                  }
                  placeholder="Select account"
                />
                {errors.purchaseAccountId && (
                  <small className="p-error">{errors.purchaseAccountId}</small>
                )}
              </div>

              <div className="col-6 field">
                <label htmlFor="purchaseTaxRateId" className="font-medium">
                  Tax rate (required)
                </label>
                <Dropdown
                  id="purchaseTaxRateId"
                  options={accounts}
                  value={formData.purchaseTaxRateId}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      purchaseTaxRateId: e.value,
                    }))
                  }
                  placeholder="Select tax rate"
                />
                {errors.purchaseTaxRateId && (
                  <small className="p-error">{errors.purchaseTaxRateId}</small>
                )}
              </div>

              <div className="col-12 field">
                <label htmlFor="purchaseDescription" className="font-medium">
                  Purchase Description
                </label>
                <InputTextarea
                  id="purchaseDescription"
                  className="w-full"
                  rows={3}
                  placeholder="Description"
                  value={formData.purchaseDescription}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      purchaseDescription: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div className="col-12 mt-2 mb-3">
            <Checkbox
              id="sell"
              checked={formData.isSold}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  isSold: e.checked ?? false,
                }))
              }
            />
            <label htmlFor="sell" className="ml-2">
              Sell
            </label>
          </div>

          {formData.isSold && (
            <>
              <div className="col-6 field">
                <label htmlFor="salePrice" className="font-medium">
                  Sale price (required)
                </label>
                <InputText
                  id="salePrice"
                  placeholder="Sale price"
                  value={formData.salePrice || ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      salePrice: e.target.value,
                    }))
                  }
                />
                {errors.salePrice && (
                  <small className="p-error">{errors.salePrice}</small>
                )}
              </div>

              <div className="col-6 field">
                <label htmlFor="salesAccountId" className="font-medium">
                  Sales account (required)
                </label>
                <Dropdown
                  options={accounts}
                  value={formData.salesAccountId}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      salesAccountId: e.value,
                    }))
                  }
                  placeholder="Select account"
                />
                {errors.salesAccountId && (
                  <small className="p-error">{errors.salesAccountId}</small>
                )}
              </div>

              <div className="col-6 field">
                <label htmlFor="salesTaxRateId" className="font-medium">
                  Sales tax rate (required)
                </label>
                <Dropdown
                  options={accounts}
                  value={formData.salesTaxRateId}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      salesTaxRateId: e.value,
                    }))
                  }
                  placeholder="Select tax rate"
                />
                {errors.salesTaxRateId && (
                  <small className="p-error">{errors.salesTaxRateId}</small>
                )}
              </div>

              <div className="col-12 field">
                <label htmlFor="salesDescription" className="font-medium">
                  Sales Description
                </label>
                <InputTextarea
                  rows={3}
                  placeholder="Description"
                  value={formData.salesDescription}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      salesDescription: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          <Button label="Save" className="p-button-primary" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
