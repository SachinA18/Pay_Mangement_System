import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fixedAmount } from "../../helpers/template.helper";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceItem {
  description: string;
  price: number;
  qty: number;
  taxRate: number;
  amount: number;
}

interface Invoice {
  invoiceNumber: string;
  reference: string;
  dueDate: string;
  status: number;
  subTotal: number;
  totalTax: number;
  total: number;
  currencyId: string;
  invoiceItems: InvoiceItem[];
}

interface Customer {
  contactName: string;
  businessInfoWebsite: string;
  businessInfoBusinessRegNumber: string;
}

const InvoicePreview = () => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate("/invoice-form/00000000-0000-0000-0000-000000000000");
  }

  const handlePdf = (): void => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("Calculx - Sample Company", 14, 30);
    doc.text("Your Company Address", 14, 38);
    doc.text("Phone: (123) 456-7890 | Email: info@company.com", 14, 46);

    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 140, 30);
    doc.text(`Reference: ${invoice.reference}`, 140, 38);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 140, 46);

    doc.text(`Customer: ${customer.contactName}`, 14, 60);
    doc.text(`Website: ${customer.businessInfoWebsite}`, 14, 68);
    doc.text(`Registration #: ${customer.businessInfoBusinessRegNumber}`, 14, 76);

    const tableColumn = ["Description", "Price", "Qty", "Tax Rate", "Amount"];
    const tableRows: any[] = [];

    invoice.invoiceItems.forEach((item) => {
      const rowData = [
        item.description,
        fixedAmount(item.price),
        item.qty,
        fixedAmount(item.taxRate),
        fixedAmount(item.amount),
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: 120,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 70, 250] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${fixedAmount(invoice.subTotal)}`, 140, finalY);
    doc.text(`Total Tax: ${fixedAmount(invoice.totalTax)}`, 140, finalY + 8);
    doc.text(`Total: ${fixedAmount(invoice.total)}`, 140, finalY + 16);

    doc.text("Thank you for your business!", 14, finalY + 30);

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const invoice: Invoice = {
    invoiceNumber: '',
    reference: '',
    dueDate: '',
    status: 0,
    subTotal: 0,
    totalTax: 0,
    total: 0,
    currencyId: '',
    invoiceItems: []
  };

  const customer: Customer = {
    contactName: '',
    businessInfoWebsite: '',
    businessInfoBusinessRegNumber: ''
  };

  return (
    <div className="p-card m-3 p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Calculx - Sample Company</h1>
        <p>
          Your Company Address | Phone: (123) 456-7890 | Email: info@company.com
        </p>
        <div className="dashed-divider"></div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-center">Invoice</h1>
      </div>

      <div className="grid mb-4">
        <div className="col-6">
          <h3 className="text-lg font-medium">Customer Information</h3>
          <div className="mb-2">
            <strong>Company:</strong> {customer.contactName}
          </div>
          <div className="mb-2">
            <strong>Website:</strong> {customer.businessInfoWebsite}
          </div>
          <div className="mb-2">
            <strong>Registration #:</strong>{" "}
            {customer.businessInfoBusinessRegNumber}
          </div>
        </div>

        <div className="col-6 text-right">
          <h3 className="text-lg font-medium">Invoice Information</h3>
          <div className="mb-2">
            <strong>Invoice Number:</strong> {invoice.invoiceNumber}
          </div>
          <div className="mb-2">
            <strong>Reference:</strong> {invoice.reference}
          </div>
          <div className="mb-2">
            <strong>Due Date:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
        <DataTable value={invoice.invoiceItems} className="p-datatable-sm">
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
          <p className="text-sm">Thank you for your business!</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="text-lg font-medium" style={{ width: "120px" }}>
                Subtotal:
              </td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(invoice.subTotal)}
              </td>
            </tr>
            <tr>
              <td className="text-lg font-medium">Total Tax:</td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(invoice.totalTax)}
              </td>
            </tr>
            <tr>
              <td className="text-lg font-medium">Total:</td>
              <td className="text-right text-lg font-medium">
                {fixedAmount(invoice.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 ml-auto justify-content-end mt-4">
        <Button
            onClick={handleBack}
            className="p-button-outlined w-10rem"
            label="Back"
          />
          <Button
            onClick={handlePdf}
            className="p-button-secondary w-10rem"
            icon="pi pi-file-pdf"
            label="Download PDF"
          />
        </div>
    </div>
  );
};

export default InvoicePreview;