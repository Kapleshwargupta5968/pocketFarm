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
    <div className="w-64 bg-white border-r border-slate-100 h-full p-5 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 relative">
      <div className="flex items-center gap-3 mb-8 px-2 mt-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          🌱
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">PocketFarm</h2>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {roleMenu.map((items) => (
          <NavLink
            key={items.id}
            to={items.path}
            end={items.path === "/dashboard"}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center ${
                isActive 
                  ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {items.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-medium tracking-wide border-b border-slate-200 pb-2 mb-2">POCKETFARM v1.0</p>
        <p className="text-[10px] text-slate-400">© 2026 All rights reserved</p>
      </div>
    </div>
  );
};

export default Sidebar;
