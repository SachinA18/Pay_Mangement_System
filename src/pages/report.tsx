import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";


import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const Repaorts = () => {
  const [dates, setDates] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [reportType, setReportType] = useState("Accrual");

  return (
    <div className="p-4">
        <div className="p-4">
          <div className="flex align-items-center gap-4 mb-4">
            <div className="flex flex-column">
              <label htmlFor="start">Start Date:</label>
              <Calendar
                id="start"
                value={dates.startDate}
                onChange={(e) => setDates({ ...dates, startDate: e.value || null })}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="flex flex-column">
              <label htmlFor="end">End Date:</label>
              <Calendar
                id="end"
                value={dates.endDate}
                onChange={(e) => setDates({ ...dates, endDate: e.value ?? null })}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>

            <div className="flex align-items-center">
              <label className="mr-2">Report Type:</label>
              <div className="flex align-items-center gap-2">
                <RadioButton
                  inputId="accrual"
                  name="reportType"
                  value="Accrual"
                  onChange={(e) => setReportType(e.value)}
                  checked={reportType === "Accrual"}
                />
                <label htmlFor="accrual">Accrual</label>

                <RadioButton
                  inputId="cash"
                  name="reportType"
                  value="Cash"
                  onChange={(e) => setReportType(e.value)}
                  checked={reportType === "Cash"}
                />
                <label htmlFor="cash">Cash</label>
              </div>
            </div>

            <Button label="Update" icon="pi pi-refresh" className="p-button-info" />
            <Button label="PDF" icon="pi pi-file-pdf" className="p-button-success" />
            <Button
              label="Excel"
              icon="pi pi-file-excel"
              className="p-button-success"
            />
          </div>

          <Card>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">Generated on 2024-08-30, 12:55:27 PM</p>
              <h2 className="m-0">Profit and Loss</h2>
              <h3 className="m-1 font-bold">Dev-v1</h3>
              <p>For the period 2024-07-01 to 2024-08-30</p>
            </div>

            <div>
              <h4>Trading Income</h4>
              <div className="flex justify-content-between">
                <span>Sales</span>
                <span>1,700.00</span>
              </div>
              <div className="flex justify-content-between font-bold mt-1">
                <span>Total Trading Income</span>
                <span>1,700.00</span>
              </div>
              <hr />

              <h4>Cost of Sales</h4>
              <div className="flex justify-content-between font-bold">
                <span>Total Cost of Sales</span>
                <span>0.00</span>
              </div>
              <hr />

              <h4>Gross Profit</h4>
              <div className="flex justify-content-between font-bold">
                <span>Gross Profit</span>
                <span>1,700.00</span>
              </div>
              <hr />

              <h4>Operating Expenses</h4>
              <div className="flex justify-content-between font-bold">
                <span>Total Operating Expenses</span>
                <span>0.00</span>
              </div>
              <hr />

              <h4>Net Profit</h4>
              <div className="flex justify-content-between font-bold text-lg">
                <span>Net Profit</span>
                <span>1,700.00</span>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
};

export default Repaorts;