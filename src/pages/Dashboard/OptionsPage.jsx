import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  MdShoppingBag,
  MdRestaurantMenu,
  MdPeople,
  MdSettings
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import Grid from "../../components/Grid";

export default function OptionsPage() {
  const { user } = useContext(AuthContext);

  const cards = [
    // { name: "Reservations & Tables", path: "/tables", icon: <MdTableRestaurant size={40} />, permission: "all" },
    { name: "Orders", path: "/orders", icon: <MdShoppingBag size={40} />, permission: "all" },
    { name: "Menu", path: "/menu", icon: <MdRestaurantMenu size={40} />, permission: "all" },
    { name: "Users", path: "/users", icon: <MdPeople size={40} />, permission: "admin" },
    { name: "Reports", path: "/reports", icon: <TbReportAnalytics size={40} />, permission: "admin" },
    { name: "Profile", path: "/profile", icon: <MdSettings size={40} />, permission: "all" },
  ];

  const visibleCards = cards.filter(
    (card) => card.permission === "all" || user?.role === "admin"
  );

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCards.map((card) => (
          <Grid key={card.name} path={card.path} name={card.name} icon={card.icon} />
        ))}
      </div>
    </div >
  );
}
