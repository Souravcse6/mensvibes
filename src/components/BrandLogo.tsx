import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  theme?: 'dark' | 'light' | 'colorful';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Dimension scales
  const sizeMap = {
    sm: { iconHeight: 28, textMain: 'text-lg', textSub: 'text-[8px]' },
    md: { iconHeight: 38, textMain: 'text-2xl', textSub: 'text-[9.5px]' },
    lg: { iconHeight: 52, textMain: 'text-3xl', textSub: 'text-[11px]' },
    xl: { iconHeight: 70, textMain: 'text-4xl', textSub: 'text-[13px]' },
  };

  const currentSize = sizeMap[size];

  // Theme color maps
  const isLight = theme === 'light';

  // Vector Shoe Icon matching user's exact logo image
  const ShoeEmblem = (
    <svg
      viewBox="0 0 300 180"
      className="shrink-0"
      style={{ height: `${currentSize.iconHeight}px`, width: 'auto' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upper Shoe Leather Body */}
      <path
        d="M 35 110 C 45 60 90 25 130 25 C 155 25 178 45 190 58 C 215 70 248 76 272 76 C 285 76 290 92 260 110 C 215 128 140 120 35 110 Z"
        fill="#8B3A13"
      />

      {/* Decorative Laces Cutouts */}
      <ellipse cx="160" cy="52" rx="20" ry="5" transform="rotate(-22 160 52)" fill={isLight ? '#FAF6EE' : '#1C1917'} />
      <ellipse cx="182" cy="64" rx="20" ry="5" transform="rotate(-22 182 64)" fill={isLight ? '#FAF6EE' : '#1C1917'} />

      {/* Top Sole Layer - Salmon/Orange */}
      <path
        d="M 35 118 C 110 148 200 148 272 98 C 250 122 180 152 35 138 Z"
        fill="#E88D67"
      />

      {/* Middle Sole Layer - Terra Cotta */}
      <path
        d="M 35 135 C 110 160 190 160 250 126 C 210 162 125 162 48 150 Z"
        fill="#C86A43"
      />

      {/* Bottom Base Sole - Deep Black */}
      <path
        d="M 48 152 C 110 174 190 174 232 146 C 190 180 100 178 48 162 Z"
        fill="#1A1A1A"
      />
    </svg>
  );

  const mainTextColor = isLight
    ? 'text-[#7A3311]'
    : theme === 'colorful'
    ? 'text-[#E88D67]'
    : 'text-amber-100';

  const subTextColor = isLight
    ? 'text-[#D97A4E]'
    : theme === 'colorful'
    ? 'text-amber-300'
    : 'text-[#E88D67]';

  if (variant === 'icon') {
    return (
      <div onClick={onClick} className={`inline-flex items-center cursor-pointer ${className}`}>
        {ShoeEmblem}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center cursor-pointer select-none group ${className}`}
      >
        <div className="mb-1 transform group-hover:scale-105 transition-transform duration-300">
          {ShoeEmblem}
        </div>
        <span
          className={`font-serif font-black tracking-[0.18em] uppercase ${currentSize.textMain} ${mainTextColor} leading-none transition-colors`}
        >
          MENSVIBES
        </span>
        <span
          className={`font-sans font-bold tracking-[0.35em] uppercase ${currentSize.textSub} ${subTextColor} mt-1.5`}
        >
          COMFORT MEETS STYLE
        </span>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <div className="transform group-hover:scale-105 transition-transform duration-300">
        {ShoeEmblem}
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-extrabold tracking-[0.14em] uppercase ${currentSize.textMain} ${mainTextColor} leading-none group-hover:text-amber-300 transition-colors`}
        >
          MENSVIBES
        </span>
        <span
          className={`font-sans font-bold tracking-[0.25em] uppercase ${currentSize.textSub} ${subTextColor} mt-1`}
        >
          COMFORT MEETS STYLE
        </span>
      </div>
    </div>
  );
};
