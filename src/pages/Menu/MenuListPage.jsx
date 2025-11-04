import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import OptionsButton from '../../components/OptionsButton';
import DataTable from '../../components/DataTables';
import { LuCheck, LuPen, LuX } from 'react-icons/lu';

function MenuListPage() {
    const token = localStorage.getItem('token');
    const [menuItems, setMenuItems] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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
                        <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-700">
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
                                        <p className="text-zinc-400 text-sm mt-1">LKR {item.price?.toFixed(2)}</p>
                                    </div>

                                    <button
                                        // onClick={() => onEdit(item)}
                                        className="p-1.5 rounded-full hover:bg-zinc-700 transition-colors"
                                        aria-label="Edit item"
                                    >
                                        <LuPen className="h-5 w-5 text-zinc-300 hover:text-white" />
                                    </button>
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
        </div>
    )
}

export default MenuListPage