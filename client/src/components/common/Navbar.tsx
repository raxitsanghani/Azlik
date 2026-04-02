import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Collections', path: '/products' },
    { name: 'Faucets', path: '/products/faucets' },
    { name: 'Showers', path: '/products/showers' },
    { name: 'Mirrors', path: '/products/mirrors' },
    { name: 'Accessories', path: '/products/accessories' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isHome = location.pathname === '/';

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-6 md:px-12 py-6
        ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent'}
        ${!isHome && !scrolled ? 'bg-white/50 backdrop-blur-sm' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="relative z-[110]">
          <h1 className={`text-2xl font-serif tracking-[0.2em] italic transition-colors duration-500
            ${!scrolled && isHome ? 'text-white' : 'text-premium-charcoal'}
          `}>
            AZLIK
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`premium-subheading transition-all duration-300 hover:opacity-100
                ${!scrolled && isHome ? 'text-white/80 opacity-80' : 'text-premium-charcoal/60 opacity-100'}
                ${location.pathname === link.path ? '!opacity-100 font-bold' : ''}
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={`p-2 transition-colors duration-500
                  ${!scrolled && isHome ? 'text-white hover:text-white/60' : 'text-premium-charcoal hover:text-premium-royal'}
                `}
              >
                <User size={20} />
              </Link>
              <button 
                onClick={handleLogout}
                className={`p-2 transition-colors duration-500
                  ${!scrolled && isHome ? 'text-white hover:text-white/60' : 'text-premium-charcoal hover:text-red-600'}
                `}
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`premium-subheading border px-6 py-2 transition-all duration-500
                ${!scrolled && isHome 
                  ? 'text-white border-white/20 hover:bg-white hover:text-premium-charcoal' 
                  : 'text-premium-charcoal border-premium-charcoal/20 hover:bg-premium-charcoal hover:text-white'}
              `}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden relative z-[110] p-2
            ${!scrolled && isHome && !isOpen ? 'text-white' : 'text-premium-charcoal'}
          `}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-serif text-3xl tracking-wider text-premium-charcoal hover:text-premium-royal transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] w-12 bg-premium-charcoal/10 my-4" />
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="premium-subheading text-premium-charcoal" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="premium-subheading text-red-600">Logout</button>
              </>
            ) : (
              <Link to="/login" className="premium-subheading text-premium-charcoal" onClick={() => setIsOpen(false)}>Login Account</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
