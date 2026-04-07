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
        className={`w-full sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/80'
            : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                🌱
              </span>
            </div>
            <span className="text-2xl font-extrabold tracking-tighter">
              <span className="text-gray-900">Pocket</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Farm</span>
            </span>
          </NavLink>

          
          <div className="hidden md:flex items-center gap-2">
            {publicItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `group relative px-4 py-2 text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-500 font-medium hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative py-1">
                    {item.name}
                    <span 
                      className={`absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ease-out rounded-full ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} 
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <NavLink
                  to="/signin"
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors duration-300"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-1.5">
                    Start Free
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_20px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Dashboard
                </span>
              </button>
            )}
          </div>

          
          <button
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-300 gap-[5px]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[2px] bg-gray-800 rounded-full transition-transform duration-300 origin-center ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-gray-800 rounded-full transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-gray-800 rounded-full transition-transform duration-300 origin-center ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </nav>

        
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl shadow-gray-900/10 transition-all duration-500 origin-top overflow-hidden ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-6 pb-8 pt-4 flex flex-col gap-2">
            {publicItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-base font-semibold rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'text-green-700 bg-green-50/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col gap-3">
              {!user ? (
                <>
                  <NavLink
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-4 py-3.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-gray-900 text-white text-sm font-semibold px-4 py-3.5 rounded-full shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all duration-300"
                  >
                    Start Free
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-3.5 rounded-full shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all duration-300"
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