const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for the Netlify app
app.use(cors({
  origin: '*',  // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Store data in memory (in production, you'd use a database)
let orders = [];
let bookings = [];

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Endpoints for Orders
app.get('/api/orders', (req, res) => {
  console.log('Getting all orders:', orders);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const order = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    orders.push(order);
    console.log('New order added:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating order ${id}:`, req.body);
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      console.log('Order not found:', id);
      return res.status(404).json({ message: 'Order not found' });
    }
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    console.log('Order updated:', orders[orderIndex]);
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

// API Endpoints for Bookings
app.get('/api/bookings', (req, res) => {
  console.log('Getting all bookings:', bookings);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    const booking = {
      id: Date.now().toString(),
      ...req.body,
      status: 'pending'
    };
    bookings.push(booking);
    console.log('New booking added:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

app.put('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating booking ${id}:`, req.body);
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) {
      console.log('Booking not found:', id);
      return res.status(404).json({ message: 'Booking not found' });
    }
    bookings[bookingIndex] = { ...bookings[bookingIndex], ...req.body };
    console.log('Booking updated:', bookings[bookingIndex]);
    res.json(bookings[bookingIndex]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Admin server running at http://localhost:${PORT}/admin`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
}); 