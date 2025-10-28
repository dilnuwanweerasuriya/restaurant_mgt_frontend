import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DashboardButton from '../../components/DashboardButton';
import { Link } from 'react-router-dom';

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const token = localStorage.getItem("token")

    const fetchReservations = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/reservations',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = response.data;
            setReservations(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div className="p-8">
            <DashboardButton />

            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            {/* table for users */}
            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map(reservation => (
                            <tr key={reservation._id} className="divide-x divide-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.table.number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.customerPhone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                                                ${reservation.status === "Confirmed" ? "bg-green-100 text-green-700" 
                                                : reservation.status === "Cancelled" ? "bg-red-100 text-red-700"
                                                : reservation.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                                                : reservation.status === "COmpleted" ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {reservation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{reservation.notes}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/reservations/${reservation._id}`}>
                                        <button className="bg-gray-500 hover:bg-black text-white font-semibold px-4 py-2 rounded cursor-pointer">
                                            Edit
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
