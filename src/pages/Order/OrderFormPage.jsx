import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import OptionsButton from "../../components/OptionsButton";

export default function OrderFormPage() {
    const navigate = useNavigate();
    const { typeId } = useParams();

    const [formData, setFormData] = useState({
        orderType: "dine-in",
        customerName: "",
        customerPhone: "",
        items: [],
        status: "pending",
        paymentStatus: "unpaid",
    });

    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🍽️ Category and search
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // 🧭 Map numeric type from URL to readable text
    useEffect(() => {
        if (typeId === "1") setFormData((prev) => ({ ...prev, orderType: "dine-in" }));
        else if (typeId === "2") setFormData((prev) => ({ ...prev, orderType: "takeaway" }));
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

    const handleItemChange = (menuItem, name, price, qty, notes = "") => {
        setFormData((prev) => {
            const existing = prev.items.find((i) => i.menuItem === menuItem);
            if (existing) {
                // Update existing item or remove if qty is 0
                return {
                    ...prev,
                    items: prev.items
                        .map((i) =>
                            i.menuItem === menuItem ? { ...i, name, price, qty, notes } : i
                        )
                        .filter((i) => i.qty > 0), // Remove items with qty 0
                };
            } else if (qty > 0) {
                // Add new item only if qty > 0
                return {
                    ...prev,
                    items: [...prev.items, { menuItem, name, price, qty, notes }],
                };
            }
            return prev;
        });
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((total, i) => {
            return total + i.price * i.qty;
        }, 0);

        const tax = subtotal * 0.13; // 13% tax (adjust as needed)
        const serviceCharge = formData.orderType === "dine-in" ? subtotal * 0.1 : 0; // 10% service charge for dine-in
        const total = subtotal + tax + serviceCharge;

        return { subtotal, tax, serviceCharge, total };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.items.length === 0) {
            toast.error("Please select at least one item");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { subtotal, tax, serviceCharge, total } = calculateTotals();

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/orders`,
                {
                    orderType: formData.orderType,
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    items: formData.items,
                    subtotal,
                    tax,
                    serviceCharge,
                    total,
                    status: formData.status,
                    paymentStatus: formData.paymentStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Order created successfully!");
            navigate(`/orders/${res.data._id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create order");
        } finally {
            setIsLoading(false);
        }
    };

    const { subtotal, tax, serviceCharge, total } = calculateTotals();

    // 🔍 Filtered menu based on category + search
    const filteredMenu = menuItems.filter((item) => {
        const matchesCategory =
            selectedCategory === "all" ||
            (item.category &&
                item.category.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-8">
            <OptionsButton />
            <div className="max-w-6xl mx-auto p-8 bg-zinc-900 shadow-lg rounded-xl mt-10 text-zinc-100">
                <h2 className="text-2xl font-semibold mb-6 text-zinc-100 text-center">
                    New Order
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Type */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Order Type
                        </label>
                        <select
                            name="orderType"
                            value={formData.orderType}
                            disabled
                            onChange={(e) =>
                                setFormData({ ...formData, orderType: e.target.value })
                            }
                            className="w-full border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-not-allowed focus:ring-2 focus:ring-zinc-300"
                        >
                            <option value="dine-in">Dine-In</option>
                            <option value="takeaway">Takeaway</option>
                        </select>
                    </div>

                    {/* Customer Info */}
                    {formData.orderType !== "dine-in" && (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerName: e.target.value })
                                    }
                                    className="w-full border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerPhone: e.target.value })
                                    }
                                    className="w-full border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>
                        </div>
                    )}

                    <hr className="border-t border-zinc-700 my-6" />

                    {/* 🍴 Category + Search */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Category */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Category:
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-pointer focus:ring-2 focus:ring-zinc-300"
                            >
                                <option value="all">All</option>
                                <option value="starter">Starter</option>
                                <option value="main-course">Main Course</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                                <option value="others">Others</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex-1 flex items-end">
                            <input
                                type="text"
                                placeholder="Search food..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-300"
                            />
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Select Items
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-2">
                            {filteredMenu.length === 0 ? (
                                <p className="text-zinc-400 text-center w-full py-6">
                                    No items found
                                </p>
                            ) : (
                                filteredMenu.map((item) => {
                                    const selectedItem = formData.items.find(
                                        (i) => i.menuItem === item._id
                                    );
                                    const qty = selectedItem?.qty || 0;

                                    const handleIncrease = () =>
                                        handleItemChange(
                                            item._id,
                                            item.name,
                                            item.price,
                                            qty + 1
                                        );
                                    const handleDecrease = () =>
                                        qty > 0 &&
                                        handleItemChange(
                                            item._id,
                                            item.name,
                                            item.price,
                                            qty - 1
                                        );

                                    return (
                                        <div
                                            key={item._id}
                                            className={`flex flex-col items-center border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                                qty > 0
                                                    ? "border-zinc-300 bg-zinc-800"
                                                    : "border-zinc-700"
                                            }`}
                                        >
                                            <div className="w-full h-40 bg-zinc-800">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center p-4 flex-grow text-center">
                                                <h3 className="text-lg font-semibold text-zinc-100">
                                                    {item.name}
                                                </h3>
                                                <p className="text-zinc-400 text-sm mt-1">
                                                    LKR {item.price}
                                                </p>
                                                <p className="text-xs text-zinc-300 mt-1 capitalize">
                                                    {item.category}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <button
                                                    type="button"
                                                    onClick={handleDecrease}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                                        qty > 0
                                                            ? "border-zinc-700 hover:bg-zinc-700 hover:border-white hover:text-white"
                                                            : "border-zinc-700 text-zinc-400 cursor-not-allowed opacity-50"
                                                    }`}
                                                    disabled={qty === 0}
                                                >
                                                    –
                                                </button>

                                                <span className="text-lg font-semibold w-6 text-center">
                                                    {qty}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={handleIncrease}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 text-white hover:bg-zinc-800"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Order Status + Payment */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Order Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                                className="w-full border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-pointer focus:ring-2 focus:ring-zinc-300"
                            >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="served">Served</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Payment Status
                            </label>
                            <select
                                value={formData.paymentStatus}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        paymentStatus: e.target.value,
                                    })
                                }
                                className="w-full border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-pointer focus:ring-2 focus:ring-zinc-300"
                            >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                    </div>

                    {/* 🧾 Selected Items Summary */}
                    {formData.items.length > 0 && (
                        <div className="border-t border-zinc-700 pt-4 mt-6">
                            <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                                Selected Items
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-zinc-700 rounded-lg">
                                    <thead className="bg-zinc-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-300">
                                                Item
                                            </th>
                                            <th className="px-4 py-2 text-center text-sm font-medium text-zinc-300">
                                                Qty
                                            </th>
                                            <th className="px-4 py-2 text-center text-sm font-medium text-zinc-300">
                                                Price
                                            </th>
                                            <th className="px-4 py-2 text-right text-sm font-medium text-zinc-300">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.items
                                            .filter((i) => i.qty > 0)
                                            .map((i) => (
                                                <tr key={i.menuItem} className="border-t border-zinc-700">
                                                    <td className="px-4 py-2 text-zinc-100">
                                                        {i.name}
                                                    </td>
                                                    <td className="px-4 py-2 text-center text-zinc-100">
                                                        {i.qty}
                                                    </td>
                                                    <td className="px-4 py-2 text-center text-zinc-400">
                                                        LKR {i.price}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-zinc-100 font-medium">
                                                        LKR {(i.price * i.qty).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Breakdown */}
                            <div className="mt-4 space-y-2 border-t border-zinc-700 pt-4">
                                <div className="flex justify-end gap-4 text-zinc-400">
                                    <span>Subtotal:</span>
                                    <span className="w-24 text-right">
                                        LKR {subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-4 text-zinc-400">
                                    <span>Tax (13%):</span>
                                    <span className="w-24 text-right">
                                        LKR {tax.toFixed(2)}
                                    </span>
                                </div>
                                {formData.orderType === "dine-in" && (
                                    <div className="flex justify-end gap-4 text-zinc-400">
                                        <span>Service Charge (10%):</span>
                                        <span className="w-24 text-right">
                                            LKR {serviceCharge.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-end gap-4 font-semibold text-lg text-zinc-100 border-t border-zinc-700 pt-2">
                                    <span>Total:</span>
                                    <span className="w-24 text-right">
                                        LKR {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/orders/add")}
                            className="w-[200px] py-2 px-4 bg-zinc-700 text-zinc-100 rounded-lg hover:bg-zinc-600 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || formData.items.length === 0}
                            className={`w-[200px] py-2 px-4 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition ${
                                isLoading || formData.items.length === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
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