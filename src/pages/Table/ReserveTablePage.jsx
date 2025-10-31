import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import OptionsButton from "../../components/OptionsButton";

export default function ReserveTablePage() {
    const [formData, setFormData] = useState({
        tableId: "",
        customerName: "",
        customerPhone: "",
        guests: "",
        date: "",
        time: "",
        notes: "",
    });

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch available tables
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/tables`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const available = res.data.filter((t) => t.status === "Available");
                setTables(available);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tableId || !formData.customerName || !formData.customerPhone) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/reservations`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Table reserved successfully!");
            navigate("/tables");
        } catch (err) {
            console.error(err);
            toast.error("Reservation failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <OptionsButton />

            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Reserve a Table</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Select Table */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Table
                        </label>
                        <select
                            name="tableId"
                            value={formData.tableId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <option value="">-- Select a table --</option>
                            {tables.map((t) => (
                                <option key={t._id} value={t._id}>
                                    Table {t.number} ({t.seats} seats)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Guests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Guests
                        </label>
                        <input
                            type="number"
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 4"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any special request?"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/tables")}
                            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2 rounded-md text-white font-semibold ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading ? "Reserving..." : "Reserve"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
