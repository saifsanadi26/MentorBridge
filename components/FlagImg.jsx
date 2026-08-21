import React from 'react';

const FLAG_MAP = { 
  '🇩🇪': 'de', 'Germany': 'de',
  '🇺🇸': 'us', 'USA': 'us',
  '🇬🇧': 'gb', 'UK': 'gb', 
  '🇨🇦': 'ca', 'Canada': 'ca', 
  '🇦🇺': 'au', 'Australia': 'au', 
  '🇮🇪': 'ie', 'Ireland': 'ie', 
  '🇫🇷': 'fr', 'France': 'fr', 
  '🇮🇹': 'it', 'Italy': 'it', 
  '🇸🇬': 'sg', 'Singapore': 'sg',
  '🇳🇱': 'nl', 'Netherlands': 'nl'
};

export default function FlagImg({ country, size = 20, className = "" }) {
  const iso = FLAG_MAP[country];
  if (!iso) return <span>{country}</span>; 

  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      width={size} 
      height={Math.round(size * 0.67)}
      className={`inline-block rounded-[3px] border border-white/10 shadow-sm ${className}`}
      alt={country}
      style={{ objectFit: 'cover' }}
    />
  );
}