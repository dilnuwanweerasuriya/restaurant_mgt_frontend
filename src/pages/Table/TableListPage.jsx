import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import OptionsButton from '../../components/OptionsButton';

export default function TableListPage() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token")

    const fetchTables = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/tables',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = response.data;
            setTables(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, [loading]);

    return (
        <div className="p-8">
            <OptionsButton />

            <h1 className="text-2xl font-bold mb-4">All Tables</h1>
            {/* table for users */}
            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Table Number</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tables.map(table => (
                            <tr key={table._id} className="divide-x divide-gray-200">
                                <td className="px-6 py-4 text-center whitespace-nowrap">{table.number}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">{table.capacity}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                                                ${table.status === "Available" ? "bg-green-100 text-green-700" 
                                                : table.status === "Occupied" ? "bg-red-100 text-red-700"
                                                : table.status === "Reserved" ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {table.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <Link to={`/tables/${table._id}`}>
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
    )
}
