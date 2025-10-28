import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  MdTableRestaurant,
  MdShoppingBag,
  MdRestaurantMenu,
  MdPeople,
  MdSettings,
} from "react-icons/md";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cards = [
    { name: "Reservations & Tables", path: "/tables", icon: <MdTableRestaurant size={40} />, permission: "all" },
    { name: "Orders", path: "/orders", icon: <MdShoppingBag size={40} />, permission: "all" },
    { name: "Menu", path: "/menu", icon: <MdRestaurantMenu size={40} />, permission: "all" },
    { name: "Users", path: "/users", icon: <MdPeople size={40} />, permission: "admin" },
    { name: "Settings", path: "/settings", icon: <MdSettings size={40} />, permission: "all" },
  ];

  const visibleCards = cards.filter(
    (card) => card.permission === "all" || user?.role === "admin"
  );

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCards.map((card) => (
          <div
            key={card.name}
            onClick={() => navigate(card.path)}
            className="bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all"
          >
            <div className="text-black mb-4">{card.icon}</div>
            <span className="text-lg font-semibold">{card.name}</span>
          </div>
        ))}
      </div>
    </div >
  );
}
