import React from 'react';

const Logo = ({ className = "h-12 w-12" }) => {
  return (
    <div className={`${className} bg-red-600 rounded-full flex items-center justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-2/3 h-2/3"
      >
        <path d="M17 2a1 1 0 011 1v6.5a2.5 2.5 0 01-2.5 2.5H14a2 2 0 01-2-2V8h-4v2a2 2 0 01-2 2H4.5A2.5 2.5 0 012 9.5V3a1 1 0 011-1h14zm0 8V4H4v6h2V8a2 2 0 012-2h8a2 2 0 012 2v2h-1zm-6 6a3 3 0 00-3 3v1h12v-1a3 3 0 00-3-3h-6z" />
      </svg>
    </div>
  );
};

export default Logo; 