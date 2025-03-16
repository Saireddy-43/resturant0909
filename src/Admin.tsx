import React, { useEffect, useState } from 'react';

const API_URL = 'https://restaurant-api-sb1.onrender.com/api';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  timestamp: string;
}

interface Booking {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/bookings`)
        ]);

        const ordersData = await ordersRes.json();
        const bookingsData = await bookingsRes.json();

        setOrders(ordersData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg">
                <p className="font-bold">Order ID: {order.id}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Time: {new Date(order.timestamp).toLocaleString()}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Items:</h4>
                  <ul className="list-disc pl-4">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} x{item.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg">
                <p className="font-bold">Booking ID: {booking.id}</p>
                <p>Name: {booking.name}</p>
                <p>Date: {booking.date}</p>
                <p>Time: {booking.time}</p>
                <p>Guests: {booking.guests}</p>
                <p>Status: {booking.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 