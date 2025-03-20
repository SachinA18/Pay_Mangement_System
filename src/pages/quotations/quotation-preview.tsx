import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fixedAmount } from "../../helpers/template.helper";

interface QuoteItem {
  description: string;
  price: number;
  qty: number;
  taxRate: number;
  amount: number;
}

interface Quote {
  quoteNumber: string;
  reference: string;
  quoteDate: string;
  expiryDate: string;
  status: number;
  subTotal: number;
  totalTax: number;
  total: number;
  currencyId: string;
  terms: string;
  quoteItems: QuoteItem[];
}

interface Contact {
  contactName: string;
  businessInfoWebsite: string;
  businessInfoBusinessRegNumber: string;
}

const QuotationPreview = ({
  quote,
  contact,
}: {
  quote: Quote;
  contact: Contact;
}) => {
  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Calculx - Sample Company</h1>
        <p>
          Your Company Address | Phone: (123) 456-7890 | Email: info@company.com
        </p>
        <div className="dashed-divider"></div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-center">Quotation</h1>
      </div>

      <div className="grid mb-4">
        <div className="col-6">
          <h3 className="text-lg font-medium">Customer Information</h3>
          <div className="mb-2">
            <strong>Company:</strong> {contact.contactName}
          </div>
          <div className="mb-2">
            <strong>Website:</strong> {contact.businessInfoWebsite}
          </div>
          <div className="mb-2">
            <strong>Registration #:</strong>{" "}
            {contact.businessInfoBusinessRegNumber}
          </div>
        </div>

        <div className="col-6 text-right">
          <h3 className="text-lg font-medium">Quote Information</h3>
          <div className="mb-2">
            <strong>Quote Number:</strong> {quote.quoteNumber}
          </div>
          <div className="mb-2">
            <strong>Reference:</strong> {quote.reference}
          </div>
          <div className="mb-2">
            <strong>Quote Date:</strong>{" "}
            {new Date(quote.quoteDate).toLocaleDateString()}
          </div>
          <div className="mb-2">
            <strong>Expiry Date:</strong>{" "}
            {new Date(quote.expiryDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3">Quote Items</h3>
        <DataTable value={quote.quoteItems} className="p-datatable-sm">
          <Column header="Item" field="itemName" className="px-3 py-2"></Column>
          <Column
            field="description"
            header="Description"
            bodyClassName="text-wrap"
            className="px-3 py-2"
          ></Column>
          <Column
            field="price"
            header="Price"
            body={(data) => (
              <div className="flex justify-content-between">
                <span></span>
                <span>{fixedAmount(data.price)}</span>
              </div>
            )}
            className="px-3 py-2 text-right"
          ></Column>
          <Column
            field="qty"
            header="Quantity"
            body={(data) => (
              <div className="flex justify-content-between">
                <span></span>
                <span>{fixedAmount(data.qty)}</span>
              </div>
            )}
            className="px-3 py-2 text-center"
          ></Column>
          <Column
            field="taxRate"
            header="Tax Rate"
            body={(data) => (
              <div className="flex justify-content-between">
                <span></span>
                <span>{fixedAmount(data.taxRate)}</span>
              </div>
            )}
            className="px-3 py-2 text-right"
          ></Column>
          <Column
            field="amount"
            header="Amount"
            body={(data) => (
              <div className="flex justify-content-between">
                <span></span>
                <span>{fixedAmount(data.amount)}</span>
              </div>
            )}
            className="px-3 py-2 text-right"
          ></Column>
        </DataTable>
      </div>
      <div className="flex justify-content-between pt-3">
        <div>
          <p className="text-sm">Terms: {quote.terms || "N/A"}</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="text-lg font-medium" style={{ width: "120px" }}>
                Subtotal:
              </td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(quote.subTotal)}
              </td>
            </tr>
            <tr>
              <td className="text-lg font-medium">Total Tax:</td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(quote.totalTax)}
              </td>
            </tr>
            <tr>
              <td className="text-lg font-medium">Total:</td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(quote.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationPreview;
