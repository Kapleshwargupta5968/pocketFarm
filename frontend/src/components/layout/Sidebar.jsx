import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menu = {
    Farmer: [
      { id: 1, name: "Dashboard", path: "/dashboard" },
      { id: 2, name: "My Plots", path: "/dashboard/my-plots" },
      { id: 3, name: "Create Plot", path: "/dashboard/create-plot" },
      { id: 4, name: "Subscriptions", path: "/dashboard/subscriptions" },
      { id: 5, name: "Payment", path: "/dashboard/payments" },
    ],
    Subscriber: [
      { id: 1, name: "Dashboard", path: "/dashboard" },
      { id: 2, name: "Browse Plots", path: "/dashboard/plots" },
      { id: 3, name: "My Subscriptions", path: "/dashboard/subscriptions" },
      { id: 4, name: "Payment History", path: "/dashboard/payments" },
    ],
  };

  const roleMenu = menu[user?.role] || [];

  return (
    <div className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-xl font-bold text-green-600 mb-6">PocketFarm</h2>

      <nav className="flex flex-col gap-2">
        {roleMenu.map((items) => (
          <NavLink
            key={items.id}
            to={items.path}
            end={items.path === "/dashboard"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition ${isActive ? "text-blue-300" : "text-gray-600"}`
            }
          >
            {items.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
