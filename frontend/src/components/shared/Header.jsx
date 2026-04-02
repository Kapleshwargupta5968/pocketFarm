import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const publicItems = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About", path: "/about" },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-green-600">
          🌱 PocketFarm
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {publicItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-green-600" : "text-gray-600 hover:text-green-600"}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <NavLink
                to="/signin"
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
