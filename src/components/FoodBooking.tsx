import React, { useState, useEffect } from 'react';
import { foodItems } from '../data/foodItems';

const FoodBooking: React.FC = () => {
  const [isBookingEnabled, setIsBookingEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkBookingAvailability = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday
      
      // Enable booking on Monday (1) and disable on Friday (5)
      const isEnabled = currentDay === 1;
      const isDisabled = currentDay === 5;
      
      setIsBookingEnabled(isEnabled);
      if (isDisabled) {
        setMessage('Booking is disabled on Fridays. Please try another day.');
      } else if (!isEnabled) {
        setMessage('Booking is only available on Mondays.');
      } else {
        setMessage('Welcome! You can book your food items now.');
      }
    };

    checkBookingAvailability();
    // Check availability every minute
    const interval = setInterval(checkBookingAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleItemSelect = (itemId: number) => {
    if (!isBookingEnabled) {
      alert('Booking is only available on Mondays!');
      return;
    }

    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleBooking = () => {
    if (!isBookingEnabled) {
      alert('Booking is only available on Mondays!');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please select at least one item to book!');
      return;
    }

    // Here you would typically make an API call to process the booking
    const bookedItems = foodItems.filter(item => selectedItems.includes(item.id));
    const total = bookedItems.reduce((sum, item) => sum + item.price, 0);
    
    alert(`Booking successful!\nTotal amount: $${total.toFixed(2)}`);
    setSelectedItems([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className={`mb-4 p-4 rounded-lg ${isBookingEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="text-lg font-semibold">{message}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodItems.map(item => (
          <div 
            key={item.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all
              ${selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
              ${!isBookingEnabled ? 'opacity-50' : 'hover:shadow-lg'}`}
            onClick={() => handleItemSelect(item.id)}
          >
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleBooking}
          disabled={!isBookingEnabled || selectedItems.length === 0}
          className={`px-6 py-2 rounded-lg text-white font-semibold
            ${isBookingEnabled && selectedItems.length > 0
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Book Selected Items
        </button>
      </div>
    </div>
  );
};

export default FoodBooking; 