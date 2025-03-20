export const defaultGUID = "00000000-0000-0000-0000-000000000000";

export const defaultInvoiceItem = {
  id: defaultGUID,
  InvoiceId: defaultGUID,
  itemId: defaultGUID,
  description: "",
  qty: 1,
  price: 0,
  taxRate: 0,
  amount: 0,
};

export const defaultInvoice = {
  id: defaultGUID,
  tenantId: defaultGUID,
  paymentType: 1,
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
  invoiceNumber: "INV-",
  amountDue: 0,
  amountPaid: 0,
  amountCredited: 0,
  isActive: false,
  invoiceItems: [{ ...defaultInvoiceItem }],
};

export const errorState = {
  contactId: "",
  date: "",
  dueDate: "",
  invoiceNumber: "",
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

export const paymentTypes = [
  {
    label: "Cash",
    value: 1,
    icon: "https://cdn-icons-png.freepik.com/512/8372/8372010.png",
  },
  {
    label: "Visa/MasterCard",
    value: 2,
    icon: "https://getsby.com/wp-content/uploads/2023/01/Visa-Mastercard-1-1024x378.png",
  },
  {
    label: "American Express",
    value: 3,
    icon: "https://www.svgrepo.com/show/328148/amex.svg",
  },
  {
    label: "Bank Transfer",
    value: 4,
    icon: "https://www.svgrepo.com/show/266135/bank-transfer.svg",
  },
];
