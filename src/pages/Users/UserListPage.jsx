import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import OptionsButton from "../../components/OptionsButton";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTables";
import { LuPen } from "react-icons/lu";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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
            render: (value) => (
                <Link to={`/users/${value}`} className="text-white hover:text-blue-500 hover:underline flex justify-center"><LuPen /></Link>
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
                            placeholder="Search food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-[200px] h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                        />
                    </div>
                </div>
            </div>

            <DataTable columns={columns} data={filteredUsers} keyField="_id" />
        </div>
    );
}