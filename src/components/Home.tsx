import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Home = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Logo />
              <span className="ml-3 text-xl font-semibold text-gray-800">Master Chef</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {currentUser}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-red-600">Master Chef</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the finest Indian cuisine, crafted with passion and served with excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Today's Specials</h3>
            <p className="text-gray-600">Explore our chef's special dishes, crafted with fresh ingredients.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Delivery</h3>
            <p className="text-gray-600">Fast and reliable delivery service to bring your favorite dishes to your doorstep.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Special Offers</h3>
            <p className="text-gray-600">Exclusive deals and discounts for our registered customers.</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add menu items or featured dishes here */}
          {/* This is a placeholder for future menu items */}
        </div>
      </main>
    </div>
  );
};

export default Home; 