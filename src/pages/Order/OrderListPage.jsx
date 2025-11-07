import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import OptionsButton from "../../components/OptionsButton";
import DataTable from "../../components/DataTables";
import { AuthContext } from "../../context/AuthContext";
import PrintBill from "../../components/PrintBill";


export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [orderTypeFilter, setOrderTypeFilter] = useState("");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("");

    const { user } = useContext(AuthContext);

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter((order) =>
                order.items.some((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }


        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                    orderDate.getFullYear() === filterDate.getFullYear() &&
                    orderDate.getMonth() === filterDate.getMonth() &&
                    orderDate.getDate() === filterDate.getDate()
                )
            })
        }

        if (orderTypeFilter) {
            filtered = filtered.filter((order) =>
                order.orderType === orderTypeFilter
            );
        }

        if (paymentStatusFilter) {
            filtered = filtered.filter((order) =>
                order.paymentStatus === paymentStatusFilter
            );
        }

        if (orderStatusFilter) {
            filtered = filtered.filter((order) =>
                order.status === orderStatusFilter
            );
        }

        return filtered;
    }, [orders, searchTerm, dateFilter, orderTypeFilter, paymentStatusFilter, orderStatusFilter]);

    const clearFilters = () => {
        setSearchTerm("");

        const today = new Date();
        setDateFilter(today.toISOString().split('T')[0]);

        setOrderTypeFilter("");
        setPaymentStatusFilter("");
        setOrderStatusFilter("");
    }


    const columns = [
        {
            key: "createdAt",
            header: "Ordered Time",
            render: (value) =>
                new Date(value).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
        },
        {
            key: "orderType",
            header: "Order Type",
            render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
        },
        {
            key: "items",
            header: "Items",
            render: (items) => (
                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={item._id} className="text-zinc-300">
                            {item.name}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            key: "subtotal",
            header: "Subtotal",
            render: (v) => `LKR ${v?.toFixed(2)}`,
        },
        {
            key: "total",
            header: "Total",
            render: (v) => `LKR ${v?.toFixed(2)}`,
        },
        {
            key: "paymentStatus",
            header: "Payment Status",
            render: (status) => (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
            ${status === "paid"
                            ? "bg-green-900/30 text-green-400"
                            : status === "unpaid"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-zinc-700 text-zinc-300"
                        }`}
                >
                    {status}
                </span>
            ),
        },
        {
            key: "status",
            header: "Order Status",
            render: (status) => {
                const colorMap = {
                    pending: "bg-yellow-900/30 text-yellow-400",
                    preparing: "bg-orange-900/30 text-orange-400",
                    ready: "bg-green-900/30 text-green-400",
                    served: "bg-green-900/30 text-green-400",
                    completed: "bg-green-900/30 text-green-400",
                    cancelled: "bg-red-900/30 text-red-400",
                };
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${colorMap[status] || "bg-zinc-700 text-zinc-300"
                            }`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            header: "Actions",
            render: (_, order) => (
                <PrintBill
                    orderData={order}
                    buttonText="Print"
                    showIcon={true}
                />
            ),
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />

            <div className="flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold">All Orders</h1>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Search by item name */}
                    <div className="flex flex-col">
                        <label className="text-sm text-zinc-400 mb-1">
                            Search by Item Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="flex flex-col">
                        <label className="text-sm text-zinc-400 mb-1">
                            Date Filter
                        </label>
                        <input
                            type="date"
                            value={dateFilter}
                            disabled={user?.role !== "admin"}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-zinc-500"
                        />
                    </div>

                    {/* Order Type Filter */}
                    <div className="flex flex-col">
                        <label className="text-sm text-zinc-400 mb-1">
                            Order Type
                        </label>
                        <select
                            value={orderTypeFilter}
                            onChange={(e) => setOrderTypeFilter(e.target.value)}
                            className="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-zinc-500"
                        >
                            <option value="">All Types</option>
                            <option value="dine-in">Dine In</option>
                            <option value="takeaway">Takeaway</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div className="flex flex-col">
                        <label className="text-sm text-zinc-400 mb-1">
                            Payment Status
                        </label>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-zinc-500"
                        >
                            <option value="">All Payment Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Order Status Filter */}
                    <div className="flex flex-col">
                        <label className="text-sm text-zinc-400 mb-1">
                            Order Status
                        </label>
                        <select
                            value={orderStatusFilter}
                            onChange={(e) => setOrderStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-zinc-500"
                        >
                            <option value="">All Order Status</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="served">Served</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-zinc-400">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            </div>

            <DataTable columns={columns} data={filteredOrders} keyField="_id" />
        </div>
    );
}
