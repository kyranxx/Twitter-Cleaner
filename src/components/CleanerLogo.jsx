import React from 'react';

const CleanerLogo = ({ className }) => (
  <svg 
    viewBox="0 0 500 500" 
    className={className}
    fill="currentColor"
  >
    <path d="M380 140c-20-20-45-30-70-30H190c-25 0-50 10-70 30-20 20-30 45-30 70v80c0 25 10 50 30 70 20 20 45 30 70 30h120c25 0 50-10 70-30 20-20 30-45 30-70v-80c0-25-10-50-30-70zM310 310H190c-15 0-30-5-40-15-10-10-15-25-15-40v-80c0-15 5-30 15-40 10-10 25-15 40-15h120c15 0 30 5 40 15 10 10 15 25 15 40v80c0 15-5 30-15 40-10 10-25 15-40 15z"/>
    <path d="M420 220l-40 40h-40l40-40h40zM160 260h-40l-40-40h40l40 40z"/>
    <circle cx="380" cy="180" r="15"/>
    <circle cx="420" cy="180" r="15"/>
  </svg>
);

export default CleanerLogo;
