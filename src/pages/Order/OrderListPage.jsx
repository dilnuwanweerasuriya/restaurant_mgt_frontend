import React, { useEffect, useState } from 'react'
import OptionsButton from '../../components/OptionsButton'
import axios from 'axios';

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token")

    const fetchOrders = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/orders',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = response.data;
            setOrders(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    return (
        <div className="p-8">
            <OptionsButton />

            <h1 className="text-2xl font-bold mb-4">All Orders</h1>
            {/* table for users */}
            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Time</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="divide-x divide-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    {new Date(order.createdAt).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{order.orderType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    <ul>
                                        {order.items.map((item) => (
                                            <li key={item._id}>{item.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">LKR {order.subtotal?.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">LKR {order.total?.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                                                ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" 
                                                : order.paymentStatus === "unpaid" ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize 
                                                ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" 
                                                : order.status === "preparing" ? "bg-orange-100 text-orange-700"
                                                : order.status === "ready" ? "bg-green-100 text-green-700"
                                                : order.status === "served" ? "bg-green-100 text-green-700"
                                                : order.status === "completed" ? "bg-green-100 text-green-700"
                                                : order.status === "cancelled" ? "bg-cancelled-100 text-cancelled-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
