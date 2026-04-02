import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const publicItems = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'About', path: '/about' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-green-900/5 border-b border-white/60'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <NavLink
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-md shadow-green-400/40 text-lg group-hover:scale-105 transition-transform duration-200">
              🌱
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Pocket</span>
              <span className="text-green-600">Farm</span>
            </span>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            {publicItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `group relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-green-700'
                      : 'text-gray-600 hover:text-green-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative py-1">
                    {item.name}
                    <span 
                      className={`absolute bottom-0 left-0 h-[2px] bg-green-600 transition-all duration-300 ease-out rounded-full ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} 
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </div>

        
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <NavLink
                  to="/signin"
                  className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-green-50"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-green-400/30 hover:shadow-green-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-green-400/30 hover:shadow-green-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Dashboard
              </button>
            )}
          </div>

        
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-green-50 transition-colors duration-200 gap-1.5"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </nav>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-5 pt-2 flex flex-col gap-1 border-t border-gray-100/80">
            {publicItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'text-green-700 bg-green-50 font-semibold'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50/70'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
              {!user ? (
                <>
                  <NavLink
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:border-green-400 hover:text-green-700 transition-all duration-150"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-green-400/30"
                  >
                    Get Started
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-green-400/30"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;