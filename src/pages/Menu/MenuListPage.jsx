import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import DashboardButton from '../../components/DashboardButton';

function MenuListPage() {
  const token = localStorage.getItem('token');
  const [menuItems, setMenuItems] = useState([]);

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

  return (
    <div className="p-8">
      <DashboardButton />

      <h1 className="text-2xl font-bold mb-4">All Tables</h1>
      {/* table for users */}
      <div className="">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200">
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map(items => (
              <tr key={items._id} className="divide-x divide-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                  <img src={items.image} alt={items.name} className="w-16 h-16 object-cover rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{items.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{items.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{items.available ? "Available" : "Not Available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MenuListPage