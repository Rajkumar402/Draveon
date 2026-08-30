import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="DRAVEON Logo" 
      className={`${className} object-contain`} 
    />
  );
}
