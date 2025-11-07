import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import OptionsButton from '../../components/OptionsButton';
import { LuCheck, LuPen, LuX } from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';

function MenuListPage() {
    const token = localStorage.getItem('token');

    const { user } = useContext(AuthContext);

    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        available: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function getMenu() {
        try {
            const menu = await axios.get(import.meta.env.VITE_BACKEND_URL + '/menus',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMenuItems(menu.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch menu items");
        }
    }

    useEffect(() => {
        getMenu();
    }, []);

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

    const onEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name || '',
            price: item.price || '',
            category: item.category || '',
            description: item.description || '',
            image: item.image || '',
            available: item.available ?? true
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price) // Convert price to number
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/menus/${editingItem._id}`,
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Menu item updated successfully');
                setMenuItems(prevItems =>
                    prevItems.map(item =>
                        item._id === editingItem._id
                            ? {
                                ...item,
                                ...formData,
                                price: parseFloat(formData.price) // Ensure price is a number in local state
                            }
                            : item
                    )
                );
                closeModal();
            }
        } catch (error) {
            console.error('Error updating menu item:', error);
            toast.error('Failed to update menu item');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            name: '',
            price: '',
            category: '',
            description: '',
            image: '',
            available: true
        });
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />

            <div className="flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold">Menu List</h1>
            </div>

            <div className="flex justify-end items-center mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Category:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-[180px] h-[42px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800 text-zinc-100 cursor-pointer focus:ring-2 focus:ring-zinc-300"
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

            <hr className="my-4 border-zinc-700" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    filteredMenu.map((item) => (
                        <div key={item._id} className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-700">
                            <div className="relative h-40 w-full">
                                <img
                                    src={item.image || '/placeholder-menu-item.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/placeholder-menu-item.jpg";
                                    }}
                                />
                                {item.available === false && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="bg-red-900/80 text-red-100 px-3 py-1 rounded-full text-sm font-medium">
                                            Unavailable
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                                        <p className="text-zinc-400 text-sm mt-1">
                                            LKR {typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
                                        </p>
                                    </div>


                                    {
                                        user.role === 'admin' && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-1.5 rounded-full hover:bg-zinc-700 transition-colors"
                                                aria-label="Edit item"
                                            >
                                                <LuPen className="h-5 w-5 text-zinc-300 hover:text-white" />
                                            </button>
                                        )
                                    }
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="text-sm text-zinc-300">
                                        {item.available ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-zinc-800 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                            <h2 className="text-xl font-semibold text-white">Edit Menu Item</h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-full hover:bg-zinc-700 transition-colors"
                            >
                                <LuX className="h-5 w-5 text-zinc-300 hover:text-white" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Item Name */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                                    placeholder="Enter item name"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Price (LKR)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                                    placeholder="Enter price"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    disabled
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-zinc-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="starter">Starter</option>
                                    <option value="main-course">Main Course</option>
                                    <option value="dessert">Dessert</option>
                                    <option value="drinks">Drinks</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                                    placeholder="Enter item description"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    disabled
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                                    placeholder="Enter image URL"
                                />
                            </div>

                            {/* Availability */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="available"
                                    id="available"
                                    checked={formData.available}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-green-600 bg-zinc-700 border-zinc-600 rounded focus:ring-green-500"
                                />
                                <label htmlFor="available" className="text-sm font-medium text-zinc-300">
                                    Available
                                </label>
                            </div>

                            {/* Modal Footer */}
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
                                            Update Item
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MenuListPage