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
      {/* Premium Logo Icon Square */}
      <svg 
        width="36" 
        height="36" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all duration-500"
      >
        <rect width="100" height="100" fill={brandColor} />
        {/* Abstract Stylized 'A' cutout matching the reference image */}
        <path 
          d="M25 85L47.5 20L52.5 20L75 85H64L50 42L36 85H25Z" 
          fill={iconInsetColor} 
        />
        {/* Subtle curve detail from reference screenshot */}
        <path 
          d="M72.5 85C77.5 85 82.5 81.5 85 85H72.5Z" 
          fill={iconInsetColor} 
        />
      </svg>
      
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
