import axios from "axios";
import { useEffect, useState } from "react";
import DashboardButton from "../../components/DashboardButton";
import { Link } from "react-router-dom";

export default function UserListPage() {

    const [users, setUsers] = useState([]);
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

    return (
        <div className="p-8">
            <DashboardButton />

            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            {/* table for users */}
            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="divide-x divide-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/users/${user._id}`}>
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