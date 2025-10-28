import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="flex items-center justify-between bg-white shadow px-8 py-4">
            <span className="text-gray-800 font-medium">
                Logged in as <strong>{user?.name}</strong>
            </span>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded cursor-pointer"
            >
                Logout
            </button>
        </div>
    );
}
