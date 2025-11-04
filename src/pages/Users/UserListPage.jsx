import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import OptionsButton from "../../components/OptionsButton";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTables";
import { LuCheck, LuPen, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem("token")

    const fetchUsers = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = response.data;
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        let filtered = [...users];

        if (role === "admin") {
            filtered = filtered.filter((user) => user.role === "admin");
        } else if (role === "cashier") {
            filtered = filtered.filter((user) => user.role === "cashier");
        }

        if (searchQuery) {
            filtered = filtered.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return filtered;
    }, [users, role, searchQuery]);

    const onEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || ""
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Only send fields that should be updated
            const updateData = {
                name: formData.name,
                role: formData.role
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${editingUser._id}`, // Fixed: _id instead of _ID
                updateData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success("User updated successfully!");
                closeModal();
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            role: ""
        });
    }

    const columns = [
        {
            key: "name",
            header: "Name"
        },
        {
            key: "email",
            header: "Email"
        },
        {
            key: "role",
            header: "Role",
            render: (value) => (
                value === "admin" ? "Admin" : "Cashier"
            )
        },
        {
            key: "_id",
            header: "Actions",
            render: (value, row) => (
                <button 
                    onClick={() => onEdit(row)}
                    className="text-white hover:text-blue-500 hover:underline mx-auto"
                >
                    <LuPen />
                </button>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />

            <div className="flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold">All Users</h1>
            </div>

            <div className="flex justify-end items-center mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            User Role
                        </label>
                        <select
                            value={role} // Added value prop
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full sm:w-[180px] h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-pointer focus:ring-2 focus:ring-zinc-300"
                        >
                            <option value="all">All</option>
                            <option value="admin">Admin</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex items-end">
                        <input
                            type="text"
                            placeholder="Search user..." // Fixed placeholder
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-[200px] h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                        />
                    </div>
                </div>
            </div>

            <DataTable columns={columns} data={filteredUsers} keyField="_id" />

            {isModalOpen && editingUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-zinc-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Edit User</h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-full hover:bg-zinc-700 transition-colors"
                            >
                                <LuX className="h-5 w-5 text-zinc-300 hover:text-white" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name" // Added name attribute
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-700 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-700 text-zinc-500 opacity-60"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role" // Added name attribute
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-700 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="cashier">Cashier</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-zinc-300 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <LuCheck className="h-4 w-4" />
                                            Update User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}