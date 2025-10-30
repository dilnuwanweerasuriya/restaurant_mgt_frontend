import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DashboardButton from "../../components/DashboardButton";

export default function OrderFormPage() {
    const navigate = useNavigate();
    const { typeId } = useParams(); // <-- e.g. /orders/new/1 or /orders/new/2

    const [formData, setFormData] = useState({
        type: "dine-in",
        customerName: "",
        phone: "",
        items: [],
    });

    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🧭 Map numeric type from URL to readable text
    useEffect(() => {
        if (typeId === "1") setFormData((prev) => ({ ...prev, type: "dine-in" }));
        else if (typeId === "2") setFormData((prev) => ({ ...prev, type: "takeaway" }));
        else if (typeId === "3") setFormData((prev) => ({ ...prev, type: "delivery" }));
    }, [typeId]);

    // Fetch menu items
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const menu = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/menus`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setMenuItems(menu.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load menu");
            }
        };
        fetchData();
    }, []);

    const handleItemChange = (menuId, quantity) => {
        setFormData((prev) => {
            const existing = prev.items.find((i) => i.menuId === menuId);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map((i) =>
                        i.menuId === menuId ? { ...i, quantity } : i
                    ),
                };
            } else {
                return { ...prev, items: [...prev.items, { menuId, quantity }] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/orders`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Order created successfully!");
            navigate(`/orders/${res.data._id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create order");
        } finally {
            setIsLoading(false);
        }
    };

    const totalAmount = formData.items.reduce((total, i) => {
        const item = menuItems.find((m) => m._id === i.menuId);
        return total + (item ? item.price * i.quantity : 0);
    }, 0);

    return (
        <div className="p-8">
            <DashboardButton />
            <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Create New Order
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            disabled // 👈 make it unchangeable if URL defines it
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                        >
                            <option value="dine-in">Dine-In</option>
                            <option value="takeaway">Takeaway</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>

                    {/* Customer Info (for takeaway/delivery) */}
                    {formData.type !== "dine-in" && (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerName: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>
                        </div>
                    )}

                    {/* Menu Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Items
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-2">
                            {menuItems.map((item) => {
                                const selectedItem = formData.items.find((i) => i.menuId === item._id);
                                const quantity = selectedItem?.quantity || 0;

                                const handleIncrease = () => handleItemChange(item._id, quantity + 1);
                                const handleDecrease = () => quantity > 0 && handleItemChange(item._id, quantity - 1);

                                return (
                                    <div
                                        key={item._id}
                                        className={`flex flex-col items-center border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${quantity > 0 ? "border-black bg-gray-50" : "border-gray-200"
                                            }`}
                                    >
                                        {/* Image */}
                                        <div className="w-full h-40 bg-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col items-center p-4 flex-grow text-center">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">Rs. {item.price}</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={handleDecrease}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border ${quantity > 0
                                                    ? "border-gray-400 hover:bg-gray-200"
                                                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                                                    }`}
                                                disabled={quantity === 0}
                                            >
                                                –
                                            </button>

                                            <span className="text-lg font-semibold w-6 text-center">
                                                {quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={handleIncrease}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:bg-gray-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order Status
                                </label>
                                <select
                                    name="type"
                                    value={formData.orderStatus}
                                    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="ready">Ready</option>
                                    <option value="served">Served</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            {formData.type !== "takeaway" && (
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Status
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.paymentStatus}
                                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.paymentType}
                                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="transfer">Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* Total */}
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>Rs. {totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/orders/add")}
                            className="w-[200px] py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-[200px] py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading ? "Processing..." : "Create Order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
