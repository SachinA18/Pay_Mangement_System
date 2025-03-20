export const defaultGUID = "00000000-0000-0000-0000-000000000000";

export const defaultBillItem = {
  id: defaultGUID,
  quotationId: defaultGUID,
  itemId: defaultGUID,
  description: "",
  qty: 1,
  price: 0,
  taxRate: 0,
  amount: 0,
};

export const defaultBill = {
  id: defaultGUID,
  tenantId: defaultGUID,
  contactId: defaultGUID,
  date: "",
  dueDate: "",
  reference: "",
  status: 1,
  lineAmountType: 1,
  subTotal: 0,
  totalTax: 0,
  total: 0,
  currencyId: defaultGUID,
  billNumber: "",
  amountDue: 0,
  amountPaid: 0,
  amountCredited: 0,
  isActive: false,
  billItems: [{ ...defaultBillItem }],
};

export const errorState = {
  contactId: "",
  date: "",
  dueDate: "",
  billNumber: "",
  currencyId: "",
  items: "",
};

export const amountOptions = [
  {
    label: "Tax Exclusive",
    value: 1,
  },
  {
    label: "Tax Inclusive",
    value: 2,
  },
];
