import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', isDark = false }) => {
  const brandColor = isDark ? '#111827' : '#FFFFFF';
  const iconInsetColor = isDark ? '#FFFFFF' : '#111827';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Azlik Luxury Final Logo" 
        className="h-9 w-auto object-contain shrink-0" 
      />
      {/* Brand Name Typography */}
      <div className="flex items-start">
        <span 
          className="text-2xl md:text-3xl font-serif font-bold tracking-tight transition-colors duration-500"
          style={{ color: brandColor }}
        >
          Azlik
        </span>
        <span 
          className="text-[10px] md:text-[12px] font-medium ml-1 mt-1 transition-colors duration-500"
          style={{ color: brandColor }}
        >
          ®
        </span>
      </div>
    </div>
  );
};

export default Logo;
