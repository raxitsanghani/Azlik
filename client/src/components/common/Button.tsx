
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  type = 'button'
}) => {
  const baseStyles = "px-8 py-4 uppercase text-[12px] font-bold tracking-[0.2em] transition-all duration-500 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-premium-charcoal text-white hover:bg-premium-navy",
    secondary: "bg-premium-navy text-white hover:bg-premium-charcoal",
    outline: "border border-premium-charcoal/20 text-premium-charcoal hover:bg-premium-charcoal hover:text-white",
    ghost: "text-premium-charcoal hover:bg-premium-charcoal/5"
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Shine sweep effect */}
      <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out"></span>
    </motion.button>
  );
};

export default Button;
