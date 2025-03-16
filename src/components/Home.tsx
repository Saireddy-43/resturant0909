import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 mb-8 rounded-full overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <img src={logo} alt="Master Chef Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
            Welcome to{' '}
            <span className="text-red-600">Master Chef</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
            Discover the finest Indian cuisine, crafted with passion and served with excellence.
            Experience authentic flavors and traditional recipes in a modern setting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-lg font-semibold transform transition-all duration-300 hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
            >
              Login to Order
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold transform transition-all duration-300 hover:bg-red-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
            >
              Create Account
            </button>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Specials</h3>
              <p className="text-gray-600">Explore our chef's special dishes, crafted daily with fresh ingredients.</p>
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
        </div>
      </div>
    </div>
  );
};

export default Home; 