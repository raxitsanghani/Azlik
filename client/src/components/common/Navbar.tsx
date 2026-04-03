import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Logo from './Logo';

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
    { name: 'Collections', path: '/collections' },
    { name: 'Faucets', path: '/faucets' },
    { name: 'Showers', path: '/showers' },
    { name: 'Mirrors', path: '/mirrors' },
    { name: 'Accessories', path: '/accessories' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-6 md:px-12 py-6
        ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent'}
        ${!isHome && !scrolled ? 'bg-white/50 backdrop-blur-sm' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Branding */}
        <Link to="/" className="relative z-[110]">
          <Logo isDark={scrolled || !isHome} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={[
                'relative inline-flex items-center justify-center',
                'uppercase font-bold',
                'text-[13px] md:text-[14px] tracking-[0.28em]',
                'transition-colors duration-300',
                // Underline animation (text-only, no highlight background)
                'after:absolute after:left-0 after:-bottom-[6px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-premium-gold after:transition-transform after:duration-300',
                'hover:after:scale-x-100',
                'hover:drop-shadow-[0_0_14px_rgba(201,162,39,0.25)]',
                // Active state
                location.pathname === link.path ? 'after:scale-x-100' : '',
                // Color scheme
                !scrolled && isHome
                  ? 'text-[#FFFFFF]/95 hover:text-[#F8F8F6]'
                  : 'text-premium-charcoal/70 hover:text-premium-charcoal/95',
              ].join(' ')}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <Link 
              to="/dashboard" 
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300
                ${!scrolled && isHome
                  ? 'text-white border-white/45 bg-premium-charcoal/20 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-105 hover:shadow-[0_0_18px_rgba(255,255,255,0.32)] hover:border-white/70'
                  : 'text-premium-charcoal border-premium-charcoal/20 bg-white/70 backdrop-blur-sm shadow-sm hover:scale-105 hover:text-premium-royal hover:border-premium-royal/40 hover:shadow-[0_0_18px_rgba(17,24,39,0.16)]'}
              `}
            >
              <User size={20} />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] font-bold transition-all duration-300
                ${!scrolled && isHome 
                  ? 'text-white border-white/45 bg-premium-charcoal/20 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-105 hover:bg-white hover:text-premium-charcoal hover:border-white'
                  : 'text-premium-charcoal border-premium-charcoal/20 bg-white/75 backdrop-blur-sm shadow-sm hover:scale-105 hover:bg-premium-charcoal hover:text-white hover:border-premium-charcoal'}
              `}
            >
              <User size={14} />
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
                className={[
                  'font-serif',
                  'text-3xl tracking-wider',
                  'text-premium-charcoal',
                  'transition-colors duration-300',
                  // text-only underline on hover
                  'relative inline-flex items-center justify-center',
                  'after:absolute after:left-0 after:-bottom-[10px] after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-premium-gold after:transition-transform after:duration-300',
                  'hover:after:scale-x-100',
                  'hover:text-premium-royal',
                ].join(' ')}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] w-12 bg-premium-charcoal/10 my-4" />
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="premium-subheading text-premium-charcoal" onClick={() => setIsOpen(false)}>Dashboard</Link>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-premium-charcoal/20 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] font-bold text-premium-charcoal hover:bg-premium-charcoal hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <User size={14} />
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
