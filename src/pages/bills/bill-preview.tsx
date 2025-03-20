import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

// Reuse your same helper logic (convertPrice, currencyRates, etc.) if needed
const currencyRates: { [key: string]: number } = {
  "Sri Lankan Rupee": 1,
  "US Dollar": 0.0033,
  Euro: 0.0028,
};

function convertPrice(price: number, currency: string) {
  return price * (currencyRates[currency] || 1);
}

interface billItem {
  item: string;
  description: string;
  qty: number;
  price: number;
  taxRate: number;
}

export default function InvoiceOutput() {
  const { id } = useParams();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const [billData, setBillData] = useState<any>({
    from: "",
    reference: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    currency: "Sri Lankan Rupee",
    amountType: "Tax exclusive",
    items: [] as billItem[],
  });

  const [loading, setLoading] = useState(false);

  // Example: fetch the invoice data when this page loads
  useEffect(() => {
    if (id) {
      // setLoading(true);
      // axios.get(`/api/invoices/${id}`)
      //   .then(res => {
      //     setInvoiceData(res.data);
      //   })
      //   .catch(err => {
      //     // handle error
      //   })
      //   .finally(() => setLoading(false));

      // For demo, we'll just mock it:
      setLoading(true);
      setTimeout(() => {
        setBillData({
          from: "Mock Customer",
          reference: "REF001",
          invoiceNumber: id,
          invoiceDate: "2025-01-11",
          dueDate: "2025-02-11",
          currency: "US Dollar",
          amountType: "Tax inclusive",
          items: [
            {
              item: "Product A",
              description: "Sample item A",
              qty: 2,
              price: 50,
              taxRate: 10,
            },
            {
              item: "Product B",
              description: "Sample item B",
              qty: 1,
              price: 200,
              taxRate: 15,
            },
          ],
        });
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 surface-card border-round shadow-2">
        Loading Bill...
      </div>
    );
  }

  if (!billData) {
    return (
      <div className="p-4 surface-card border-round shadow-2">
        Bill not found.
      </div>
    );
  }

  const {
    from,
    reference,
    invoiceNumber,
    invoiceDate,
    dueDate,
    currency,
    amountType,
    items,
  } = billData;

  const subtotal = items.reduce(
    (sum: number, i: billItem) => sum + i.qty * i.price,
    0
  );
  const totalTax = items.reduce(
    (sum: number, i: billItem) => sum + (i.qty * i.price * i.taxRate) / 100,
    0
  );
  const total = amountType === "Tax inclusive" ? subtotal + totalTax : subtotal;

  const convertedSubtotal = convertPrice(subtotal, currency);
  const convertedTotalTax =
    amountType === "Tax inclusive" ? convertPrice(totalTax, currency) : 0;
  const convertedTotal = convertPrice(total, currency);

  const handleNewBill = () => {
    // Navigate back to the 'new bill' page to create another bill
    navigate("/bill/new");
  };

  return (
    <div className="p-4 surface-card border-round shadow-2">
      <Toast ref={toast} />

      <h2 className="text-primary mb-4">Bill Output</h2>
      <div>
        <p>
          <strong>To:</strong> {from}
        </p>
        <p>
          <strong>Reference:</strong> {reference}
        </p>
        <p>
          <strong>Invoice Number:</strong> {invoiceNumber}
        </p>
        <p>
          <strong>Issue Date:</strong> {invoiceDate}
        </p>
        <p>
          <strong>Due Date:</strong> {dueDate}
        </p>
        <p>
          <strong>Currency:</strong> {currency}
        </p>
        <p>
          <strong>Amount Type:</strong> {amountType}
        </p>
      </div>

      {/* Again, you can use a PrimeReact DataTable if preferred */}
      <table className="table w-full border-1 border-round mt-4">
        <thead className="bg-primary text-white">
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Tax Rate (%)</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: billItem, index: number) => (
            <tr key={index}>
              <td>{item.item}</td>
              <td>{item.description}</td>
              <td>{item.qty}</td>
              <td>{convertPrice(item.price, currency).toFixed(2)}</td>
              <td>{item.taxRate}</td>
              <td>
                {(item.qty * convertPrice(item.price, currency)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-content-end mt-4">
        <div>
          <p>
            <strong>Subtotal:</strong> {convertedSubtotal.toFixed(2)}
          </p>
          <p>
            <strong>Total Tax:</strong> {convertedTotalTax.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> {convertedTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-content-end mt-4">
        <button
          onClick={handleNewBill}
          className="p-button p-button-success"
        >
          OK
        </button>
      </div>
    </div>
  );
}
