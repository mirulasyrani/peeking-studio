import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/useAuth';
import logo from '/peeking-logo.png';

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/book', label: 'Make Your Booking' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'shadow-[0_2px_6px_rgba(0,0,0,0.2)]' : ''
      } bg-[#0D1E50]/90 backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full shadow-md"
          />
          <span className="text-white text-lg sm:text-2xl font-bold whitespace-nowrap">
            Peeking Visuals
          </span>
        </Link>

        {/* Hamburger Icon (mobile only) */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center space-x-4">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-white px-4 py-2 rounded-full hover:bg-[#102866] transition ${
                pathname === to || pathname.startsWith(to + '/') ? 'bg-[#0D1E50]' : ''
              }`}
            >
              {label}
            </Link>
          ))}

          {!auth.isAuthenticated ? (
            <Link
              to="/admin"
              className={`text-white px-4 py-2 rounded-full hover:bg-[#102866] transition ${
                pathname === '/admin' ? 'bg-[#0D1E50]' : ''
              }`}
            >
              Admin Login
            </Link>
          ) : (
            <button
              onClick={auth.logout}
              className="text-white px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition cursor-pointer"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile menu (shown when menuOpen is true) */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`text-white px-4 py-2 rounded-lg hover:bg-[#102866] transition ${
                  pathname === to || pathname.startsWith(to + '/') ? 'bg-[#0D1E50]' : ''
                }`}
              >
                {label}
              </Link>
            ))}

            {!auth.isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`text-white px-4 py-2 rounded-lg hover:bg-[#102866] transition ${
                  pathname === '/admin' ? 'bg-[#0D1E50]' : ''
                }`}
              >
                Admin Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  auth.logout();
                  setMenuOpen(false);
                }}
                className="text-white px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
