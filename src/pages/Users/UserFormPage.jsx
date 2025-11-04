import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OptionsButton from "../../components/OptionsButton";

export default function UserFormPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setIsSubmitting(true);

            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("User added successfully!");
            navigate("/users/list");
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to add user. Try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />

            <div className="max-w-2xl mx-auto p-8 bg-zinc-800 shadow-lg rounded-xl mt-10 border border-zinc-700">
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">
                    Add User
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            <option value="admin">Admin</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-5 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="px-5 py-2 bg-zinc-300 hover:bg-zinc-400 border-2 border-zinc-200 hover:border-white text-zinc-800 rounded-md cursor-pointer transition-all duration-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2 bg-zinc-900 border-2 border-zinc-800 hover:border-white text-white rounded-md hover:bg-zinc-800 transition-all duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? "Saving..." : "Add User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
