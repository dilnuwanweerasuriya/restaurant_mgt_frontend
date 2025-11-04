import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OptionsButton from "../../components/OptionsButton";
import uploadFile from "../../utils/FileUpload";

export default function MenuFormPage() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        available: true,
        image: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalFormData = { ...formData };

            if (imageFile) {
                try {
                    const imageUrl = await uploadFile(imageFile);
                    finalFormData.image = imageUrl.data.publicUrl;
                    
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    toast.error("Failed to upload image!");
                    setIsLoading(false);
                    return;
                }
            }

            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/menus`,
                finalFormData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Menu Item added successfully!");
            navigate("/menu/list");
        } catch (err) {
            console.error(err);
            toast.error("Menu Item adding failed!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <OptionsButton />
            <div className="max-w-2xl mx-auto p-8 bg-zinc-800 shadow-lg rounded-xl mt-10 border border-zinc-700">
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">
                    Add Menu Item
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            placeholder="e.g. Chicken Biryani"
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
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            <option value="" className="bg-zinc-700">Select category</option>
                            <option value="starter" className="bg-zinc-700">Starter</option>
                            <option value="main-course" className="bg-zinc-700">Main Course</option>
                            <option value="dessert" className="bg-zinc-700">Dessert</option>
                            <option value="drinks" className="bg-zinc-700">Drinks</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            placeholder="e.g. 250"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            placeholder="Write short description about the dish..."
                        ></textarea>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className="h-4 w-4 text-zinc-500 focus:ring-zinc-500 border-zinc-600 rounded"
                        />
                        <label className="text-sm font-medium text-zinc-300">Available</label>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-600 file:text-white hover:file:bg-zinc-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 bg-zinc-900 border-2 border-zinc-800 hover:border-white text-white rounded-lg hover:bg-zinc-800 transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Saving..." : "Add Menu Item"}
                    </button>
                </form>
            </div>
        </div>
    );
}
