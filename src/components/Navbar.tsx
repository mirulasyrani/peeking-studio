import { Link, useLocation } from 'react-router-dom';
import logo from '/peeking-logo.png';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/useAuth'; // import your auth hook

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const auth = useAuth(); // get auth state and methods

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'shadow-[0_2px_6px_rgba(0,0,0,0.2)]' : 'shadow-none'}
        bg-[#0D1E50]/90 backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full shadow-md"
          />
          <span className="text-white text-2xl font-bold">Peeking Visuals</span>
        </Link>

        <nav className="flex items-center space-x-4">
          {/* Common navigation links */}
          {[
            { to: '/', label: 'Home' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/book', label: 'Make Your Booking' },
            { to: '/about', label: 'About Us' },
          ].map(({ to, label }) => (
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

          {/* Conditional admin login/logout */}
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
    </header>
  );
}
