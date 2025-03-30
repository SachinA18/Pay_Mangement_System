import React from "react";
import { Chart } from "primereact/chart";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Knob } from "primereact/knob";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const SalesDashboard: React.FC = () => {
    const barChartData = {
        labels: ["9 Jul", "10 Jul", "11 Jul", "12 Jul", "13 Jul", "14 Jul", "15 Jul"],
        datasets: [
            {
                label: "Contacts",
                data: [50, 230, 250, 200, 230, 67, 150],
                backgroundColor: "#0e94ed",
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, max: 300 },
        },
    };

    const salesData = [
        { id: 1, customer: "John Doe", amount: "$3,200", status: "Closed" },
        { id: 2, customer: "Jane Smith", amount: "$4,500", status: "Pending" },
        { id: 3, customer: "Michael Brown", amount: "$2,800", status: "Closed" },
        { id: 4, customer: "Emily Johnson", amount: "$3,750", status: "Pending" },
        { id: 5, customer: "Robert Williams", amount: "$5,600", status: "Closed" },
    ];

    return (
        <div className="p-6" style={{ minHeight: "100vh" }}>
            <div className="flex font-medium text-2xl">Sales - Dashboard</div>
            <div className="grid mt-3">
                
                <div className="col-12 md:col-6 lg:col-4">
                    <Card title="Activities this week" style={{ height: "330px" }} className="shadow-3 border-round p-4 surface-card">
                        <Chart type="bar" data={barChartData} options={barChartOptions} style={{ height: "200px" }} />
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <Card title="Demos by rep" style={{ height: "330px" }} className="shadow-3 border-round p-4 surface-card">
                        {["Alexis", "Abdullah", "Lyra", "Blaire", "Camilla", "Demetrius"].map((name, idx) => (
                            <div key={idx} className="flex justify-content-between p-2">
                                <span>{name}</span>
                                <Tag value={27 - idx} severity="info" />
                            </div>
                        ))}
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <Card className="text-center shadow-3 border-round p-4 surface-card" style={{ height: "330px" }}>
                        <h2 className="text-3xl">$11k</h2>
                        <p className="text-sm">Closed</p>
                        <h3 className="text-xl mt-3">$3,567</h3>
                        <p className="text-sm">Top deal</p>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <Card className="text-center shadow-3 border-round p-4 surface-card" style={{ height: "330px" }}>
                        <h2 className="text-4xl">$6,332</h2>
                        <p className="text-sm">Avg deal value</p>
                        <h2 className="text-4xl">32d</h2>
                        <p className="text-sm">Avg cycle length</p>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-4">
                    <Card title="Close Ratio" className="text-center shadow-3 border-round p-4 surface-card" style={{ height: "330px" }}>
                        <Knob value={25} valueColor=" #0e94ed" rangeColor=" #e8e9eb" />
                        <p className="text-xl mt-2">25%</p>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-12 mr-4">
                    <Card title="Performance this quarter" className="overflow-hidden shadow-3 border-round p-4 surface-card">
                        <div className="mb-3">
                            <span>Prospects</span>
                            <ProgressBar value={90} showValue={false} color="#0e94ed" />
                            <span className="text-sm">$115K</span>
                        </div>
                        <div className="mb-3">
                            <span>First contact</span>
                            <ProgressBar value={75} showValue={false} color="#0e94ed" />
                            <span className="text-sm">$75K</span>
                        </div>
                        <div className="mb-3">
                            <span>Qualified leads</span>
                            <ProgressBar value={60} showValue={false} color="#0e94ed" />
                            <span className="text-sm">$68K</span>
                        </div>
                        <div className="mb-3">
                            <span>Demo</span>
                            <ProgressBar value={40} showValue={false} color="#0e94ed" />
                            <span className="text-sm">$42K</span>
                        </div>
                        <div>
                            <span>Closed</span>
                            <ProgressBar value={50} showValue={false} color="#0e94ed" />
                            <span className="text-sm">$56K</span>
                        </div>
                    </Card>
                </div>

                <div className="col-12">
                    <Card title="Sales Details" className="shadow-3 border-round p-4 surface-card">
                        <DataTable value={salesData} paginator rows={5} responsiveLayout="scroll">
                            <Column field="id" header="ID" />
                            <Column field="customer" header="Customer" />
                            <Column field="amount" header="Amount" />
                            <Column field="status" header="Status" />
                        </DataTable>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default SalesDashboard;