import {
  useState,
  useRef,
  FormEvent,
  useMemo,
  ChangeEvent,
  useEffect,
  FC,
} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import ApiService from "../../services/api.service";

const defaultGUID = "00000000-0000-0000-0000-000000000000";

const defaultFormData: any = {
  id: defaultGUID,
  tenantId: localStorage.getItem("tenantId"),
  contactName: "",
  contactType: 0,
  accountNumber: "",
  businessInfoWebsite: "",
  businessInfoBusinessRegNumber: "",
  businessInfoNotes: "",
  billingAddAttention: "",
  billingAddAddress: "",
  billingAddCity: "",
  billingAddState: "",
  billingAddZipCode: "",
  billingAddCountry: "",
  deliveryAddAttention: "",
  deliveryAddAddress: "",
  deliveryAddCity: "",
  deliveryAddState: "",
  deliveryAddZipCode: "",
  deliveryAddCountry: "",
  isBillingAddUseAsDeliveryAdd: false,
  isDeliveryAddUseAsBillingAdd: false,
  bankAccName: "",
  bankAccNumber: "",
  bankAccDetails: "",
  bankAccTaxIDNumber: "",
  bankAccCurrency: "",
  isActive: true,
  contactPersonDetails: [],
  contactPhoneDetails: [],
  salesAccount: "",
  invoiceDueDate: "",
};

interface ItemFormProps {
  onContactSaved?: (savedContact: any) => void;
  selectedContact?: any;
}

const Contact: FC<ItemFormProps> = ({ onContactSaved, selectedContact }) => {
  const apiService = useMemo(() => new ApiService("contacts"), []);
  const toast: any = useRef(null);
  const [formData, setFormData]: any = useState({ ...defaultFormData });
  const [errors, setErrors] = useState<any>({});
  const [billDueDate, setBillDueDate] = useState("of the following month");
  const [amountsSetting, setAmountsSetting] = useState(
    "Use organisation settings"
  );
  const [purchaseTax, setPurchaseTax] = useState("Use organisation settings");
  const isCustomer = formData.contactType === 1;
  const isSupplier = formData.contactType === 2;
  const isEmployee = formData.contactType === 3;

  const [currencyOptions, setCurrencyOptions] = useState([]);

  const salesAccountOptions = [{ label: "Select sales account", value: "" }];
  const invoiceDueDateOptions = [
    { label: "of the following month", value: "followingMonth" },
    { label: "of the current month", value: "currentMonth" },
  ];
  const billDueDateOptions = [
    { label: "of the following month", value: "of the following month" },
    { label: "of the current month", value: "of the current month" },
  ];
  const settingsOptions = [
    { label: "Use organisation settings", value: "Use organisation settings" },
    { label: "Custom settings", value: "Custom settings" },
  ];

  useEffect(() => {
    if (selectedContact) {
      setFormData(selectedContact);
    } else {
      setFormData({ ...defaultFormData });
    }
    fetchOptions();
  }, [selectedContact]);

  const fetchOptions = async () => {
    try {
      const response: any = await apiService.get("defaults");
      console.log(response);

      setCurrencyOptions(response.currencyList);
    } catch (error) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Unable to fetch options.",
        life: 3000,
      });
    }
  };

  const handleCustomerChange = (checked: boolean) => {
    setFormData({
      ...formData,
      contactType: checked ? 1 : isSupplier ? 2 : isEmployee ? 3 : 0,
    });
  };

  const handleSupplierChange = (checked: boolean) => {
    setFormData({
      ...formData,
      contactType: checked ? 2 : isCustomer ? 1 : isEmployee ? 3 : 0,
    });
  };

  const handleEmployeeChange = (checked: boolean) => {
    setFormData({
      ...formData,
      contactType: checked ? 3 : isCustomer ? 1 : isSupplier ? 2 : 0,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors: any = {};
    
    if (!formData.contactName)
      formErrors.contactName = "Contact name is required.";
    if (!(isCustomer || isSupplier || isEmployee)) {
      formErrors.contactType =
        "Please select at least one: Customer, Supplier, or Employee.";
    }
    if (!formData.contactPersonDetails?.length) {
      formErrors.contactPersonDetails =
        "At least one contact person is required.";
    }
    if (!formData.contactPhoneDetails?.length) {
      formErrors.contactPhoneDetails = "At least one phone number is required.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please check the form for errors and try again.',
        life: 3000
      });
      return;
    }

    try {
      let response: { id?: string; message?: string };
      if (formData.id === defaultGUID) {
        response = await apiService.post(formData) as { id?: string; message?: string };
      } else {
        response = await apiService.put(formData) as { id?: string; message?: string };
      }

      if (response && response.id) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: `Contact ${formData.id === defaultGUID ? 'created' : 'updated'} successfully.`,
          life: 3000
        });

        if (onContactSaved) {
          onContactSaved(response);
        }
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save contact. Please try again.',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An unexpected error occurred. Please try again.',
        life: 3000
      });
    }
  };

  const handleCancel = () => {
    toast.current?.show({
      severity: "info",
      summary: "Action Cancelled",
      detail: "You have cancelled the operation.",
      life: 3000,
    });
  };

  const addContactPerson = () => {
    setFormData((prev: any) => ({
      ...prev,
      contactPersonDetails: [
        ...prev.contactPersonDetails,
        { firstName: "", lastName: "", emailAddress: "" },
      ],
    }));
  };

  const removeContactPerson = (index: number) => {
    setFormData((prev: any) => {
      const updatedDetails = [...prev.contactPersonDetails];
      updatedDetails.splice(index, 1);
      return { ...prev, contactPersonDetails: updatedDetails };
    });
  };

  const updateContactPerson = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const updatedDetails = [...prev.contactPersonDetails];
      updatedDetails[index][field] = value;
      return { ...prev, contactPersonDetails: updatedDetails };
    });
  };

  const addPhoneNumber = () => {
    setFormData((prev: any) => ({
      ...prev,
      contactPhoneDetails: [
        ...prev.contactPhoneDetails,
        { country: "", area: "", phoneNumber: "" },
      ],
    }));
  };

  const removePhoneNumber = (index: number) => {
    setFormData((prev: any) => {
      const updatedPhones = [...prev.contactPhoneDetails];
      updatedPhones.splice(index, 1);
      return { ...prev, contactPhoneDetails: updatedPhones };
    });
  };

  const updatePhoneNumber = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const updatedPhones = [...prev.contactPhoneDetails];
      updatedPhones[index][field] = value;
      return { ...prev, contactPhoneDetails: updatedPhones };
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="mb-3">Contact details</h3>
        <div className="field mb-4">
          <div className="flex align-items-center mb-2">
            <input
              type="checkbox"
              id="isCustomer"
              checked={isCustomer}
              onChange={(e) => handleCustomerChange(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isCustomer">
              Customer<span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          <div className="flex align-items-center mb-2">
            <input
              type="checkbox"
              id="isSupplier"
              checked={isSupplier}
              onChange={(e) => handleSupplierChange(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isSupplier">
              Supplier<span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <input
              type="checkbox"
              id="isEmployee"
              checked={isEmployee}
              onChange={(e) => handleEmployeeChange(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isEmployee">
              Employee<span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          {errors.contactType && (
            <p className="text-red-500 mt-2">{errors.contactType}</p>
          )}
        </div>
        <div className="field mb-3">
          <label htmlFor="contactName" className="block mb-2">
            Contact name<span className="text-red-500 ml-1">*</span>
          </label>
          <InputText
            id="contactName"
            name="contactName"
            placeholder="A business or person's name"
            className={`w-full ${errors.contactName ? "p-invalid" : ""}`}
            value={formData.contactName}
            onChange={handleChange}
          />
          {errors.contactName && (
            <small className="p-error">{errors.contactName}</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="accountNumber" className="block mb-2">
            Account number
          </label>
          <InputText
            id="accountNumber"
            name="accountNumber"
            placeholder="Add a unique account number..."
            className="w-full"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-3">
          Contact person(s)<span className="text-red-500 ml-1">*</span>
        </h3>
        {formData.contactPersonDetails?.map((person: any, index: number) => (
          <div key={index} className="grid formgrid align-items-center mb-3">
            <div className="col-3">
              <InputText
                placeholder="First name"
                className="w-full"
                value={person.firstName}
                onChange={(e) =>
                  updateContactPerson(index, "firstName", e.target.value)
                }
              />
            </div>
            <div className="col-3">
              <InputText
                placeholder="Last name"
                className="w-full"
                value={person.lastName}
                onChange={(e) =>
                  updateContactPerson(index, "lastName", e.target.value)
                }
              />
            </div>
            <div className="col-5">
              <InputText
                placeholder="Email"
                className="w-full"
                value={person.emailAddress}
                onChange={(e) =>
                  updateContactPerson(index, "emailAddress", e.target.value)
                }
              />
            </div>
            <div className="col-1">
              <Button
                icon="pi pi-times"
                type="button"
                className="p-button-text p-button-danger"
                onClick={() => removeContactPerson(index)}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className="p-button-text p-button-sm"
          icon="pi pi-plus"
          label="Add Contact Person"
          onClick={addContactPerson}
        />
        {errors.contactPersonDetails && (
          <small className="p-error block mt-2">
            {errors.contactPersonDetails}
          </small>
        )}
      </div>
      <div className="mb-4">
        <h3 className="mb-3">Business information</h3>
        <label className="block mb-2">
          Phone number(s)<span className="text-red-500 ml-1">*</span>
        </label>
        {formData.contactPhoneDetails?.map((phone: any, index: number) => (
          <div key={index} className="grid formgrid align-items-center mb-3">
            <div className="col-3">
              <InputText
                placeholder="Country"
                className="w-full"
                value={phone.country}
                onChange={(e) =>
                  updatePhoneNumber(index, "country", e.target.value)
                }
              />
            </div>
            <div className="col-3">
              <InputText
                placeholder="Area"
                className="w-full"
                value={phone.area}
                onChange={(e) =>
                  updatePhoneNumber(index, "area", e.target.value)
                }
              />
            </div>
            <div className="col-4">
              <InputText
                placeholder="Number"
                className="w-full"
                value={phone.phoneNumber}
                onChange={(e) =>
                  updatePhoneNumber(index, "phoneNumber", e.target.value)
                }
              />
            </div>
            <div className="col-2">
              <Button
                icon="pi pi-times"
                type="button"
                className="p-button-text p-button-danger"
                onClick={() => removePhoneNumber(index)}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className="p-button-text p-button-sm"
          icon="pi pi-plus"
          label="Add phone number"
          onClick={addPhoneNumber}
        />
        {errors.contactPhoneDetails && (
          <small className="p-error block mt-2">
            {errors.contactPhoneDetails}
          </small>
        )}
        <div className="field mb-4 mt-3">
          <label htmlFor="businessInfoWebsite" className="block mb-2">
            Website
          </label>
          <InputText
            id="businessInfoWebsite"
            name="businessInfoWebsite"
            className="w-full"
            value={formData.businessInfoWebsite}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-4">
          <label htmlFor="businessInfoBusinessRegNumber" className="block mb-2">
            Business registration number
          </label>
          <InputText
            id="businessInfoBusinessRegNumber"
            name="businessInfoBusinessRegNumber"
            className="w-full"
            value={formData.businessInfoBusinessRegNumber}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-4">
          <label htmlFor="businessInfoNotes" className="block mb-2">
            Notes
          </label>
          <InputText
            id="businessInfoNotes"
            name="businessInfoNotes"
            placeholder="Notes can only be viewed by people in your organization"
            className="w-full"
            value={formData.businessInfoNotes}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-3">Addresses</h3>
        <div className="field mb-3">
          <label htmlFor="billingAddAddress" className="block mb-2">
            Billing Address
          </label>
          <InputText
            id="billingAddAddress"
            name="billingAddAddress"
            placeholder="Enter billing address"
            className="w-full"
            value={formData.billingAddAddress}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="deliveryAddAddress" className="block mb-2">
            Delivery Address
          </label>
          <InputText
            id="deliveryAddAddress"
            name="deliveryAddAddress"
            placeholder="Enter delivery address"
            className="w-full"
            value={formData.deliveryAddAddress}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-3">Financial details</h3>
        <div className="field mb-3">
          <label htmlFor="bankAccName" className="block mb-2">
            Bank account name
          </label>
          <InputText
            id="bankAccName"
            name="bankAccName"
            placeholder="e.g. A business or person's name"
            className="w-full"
            value={formData.bankAccName}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="bankAccNumber" className="block mb-2">
            Bank account number
          </label>
          <InputText
            id="bankAccNumber"
            name="bankAccNumber"
            placeholder="e.g. 1234567890"
            className="w-full"
            value={formData.bankAccNumber}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="bankAccDetails" className="block mb-2">
            Details
          </label>
          <InputText
            id="bankAccDetails"
            name="bankAccDetails"
            placeholder="e.g. Rent"
            className="w-full"
            value={formData.bankAccDetails}
            onChange={handleChange}
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="bankAccTaxIDNumber" className="block mb-2">
            Tax ID number
          </label>
          <InputText
            id="bankAccTaxIDNumber"
            name="bankAccTaxIDNumber"
            placeholder="e.g. 123456789"
            className="w-full"
            value={formData.bankAccTaxIDNumber}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="bankAccCurrency" className="block mb-2">
            Currency
          </label>
          <Dropdown
            id="bankAccCurrency"
            value={formData.bankAccCurrency}
            options={currencyOptions}
            onChange={(e) => handleDropdownChange("bankAccCurrency", e.value)}
            placeholder="-- Select Currency --"
            className="w-full"
            optionLabel="name"
            optionValue="id"
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-3">Sales defaults</h3>
        <p className="text-sm text-gray-500 mb-4">
          Defaults can be overridden on individual invoices, quotes, and receive
          money.
        </p>
        <div className="field mb-3">
          <label htmlFor="salesAccount" className="block mb-2">
            Sales account
          </label>
          <Dropdown
            id="salesAccount"
            value={formData.salesAccount}
            options={salesAccountOptions}
            onChange={(e) => handleDropdownChange("salesAccount", e.value)}
            placeholder="Select sales account"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="invoiceDueDate" className="block mb-2">
            Invoice due date
          </label>
          <Dropdown
            id="invoiceDueDate"
            value={formData.invoiceDueDate}
            options={invoiceDueDateOptions}
            onChange={(e) => handleDropdownChange("invoiceDueDate", e.value)}
            placeholder="of the following month"
            className="w-full"
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-3">Purchase defaults</h3>
        <p className="mb-4">
          Defaults can be overridden on individual spend money, bills, and
          purchase orders.
        </p>
        <div className="field mb-3">
          <label htmlFor="billDueDate" className="mb-2">
            Bill due date
          </label>
          <Dropdown
            id="billDueDate"
            value={billDueDate}
            options={billDueDateOptions}
            onChange={(e) => setBillDueDate(e.value)}
            placeholder="Select due date"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="amountsSetting" className="mb-2">
            Amounts are
          </label>
          <Dropdown
            id="amountsSetting"
            value={amountsSetting}
            options={settingsOptions}
            onChange={(e) => setAmountsSetting(e.value)}
            placeholder="Select setting"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="purchaseTax" className="mb-2">
            Purchase tax
          </label>
          <Dropdown
            id="purchaseTax"
            value={purchaseTax}
            options={settingsOptions}
            onChange={(e) => setPurchaseTax(e.value)}
            placeholder="Select tax setting"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-content-end gap-3 p-3 border-top-1 surface-border">
        <Button
          label="Cancel"
          className="p-button-text"
          type="button"
          onClick={handleCancel}
        />
        <Button label="Save & Close" className="p-button" type="submit" />
      </div>
    </form>
  );
};

export default Contact;
