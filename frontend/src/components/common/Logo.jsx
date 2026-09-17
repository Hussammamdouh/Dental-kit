import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Logo = ({ className = "h-10 w-auto", variant = "default" }) => {
  const { currentTheme } = useTheme();
  
  const logoSrc = currentTheme === 'dark' 
    ? '/Logo Page Darkmode.png' 
    : '/Logo Page Lightmode.png';

  return (
    <img
      src={logoSrc}
      alt="DentalKit Logo"
      className={`${className} object-contain transition-all duration-300`}
    />
  );
};

export default Logo;
