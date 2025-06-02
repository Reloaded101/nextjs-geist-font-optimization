"use client";

import React, { useEffect, useState } from 'react';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userInfo'));
  }, []);

  return (
    <div className="flex items-center space-x-8">
      <a href="/" className="text-gray-300 hover:text-white">Home</a>
      <a href="/products" className="text-gray-300 hover:text-white">Products</a>
      <a href="/discord" className="text-gray-300 hover:text-white">Discord</a>
      <a href="/guide" className="text-gray-300 hover:text-white">Guide</a>
      <a href="/blog" className="text-gray-300 hover:text-white">Blog</a>
      {isLoggedIn ? (
        <a href="/dashboard" className="bg-white/10 px-4 py-2 rounded-md text-white">
          DASHBOARD
        </a>
      ) : (
        <span className="bg-white/10 px-4 py-2 rounded-md text-white cursor-not-allowed opacity-50 select-none">
          DASHBOARD
        </span>
      )}
    </div>
  );
}
