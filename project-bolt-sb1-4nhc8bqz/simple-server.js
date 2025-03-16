const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins during development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Store data in memory (in production, you'd use a database)
let orders = [];
let bookings = [];
let payments = [];

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Endpoints for Orders
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

app.get('/api/orders', (req, res) => {
  console.log('Getting all orders:', orders);
  res.json(orders);
});

// API Endpoints for Bookings
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

app.get('/api/bookings', (req, res) => {
  console.log('Getting all bookings:', bookings);
  res.json(bookings);
});

// API Endpoints for Payments
app.post('/api/payments', (req, res) => {
  try {
    console.log('Received payment data:', req.body);
    const payment = {
      id: Date.now().toString(),
      ...req.body,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
    
    // Update order status if order ID is provided
    if (payment.orderId) {
      const order = orders.find(o => o.id === payment.orderId);
      if (order) {
        order.status = 'paid';
        order.paymentId = payment.id;
      }
    }
    
    payments.push(payment);
    console.log('Payment processed:', payment);
    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing payment', 
      error: error.message 
    });
  }
});

// Simple admin API to get all data
app.get('/api/admin/data', (req, res) => {
  res.json({
    orders,
    bookings,
    payments
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Try different ports if the default one is in use
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`API Server running at http://localhost:${port}`);
      console.log(`API endpoints available at:`);
      console.log(`- http://localhost:${port}/api/orders`);
      console.log(`- http://localhost:${port}/api/bookings`);
      console.log(`- http://localhost:${port}/api/payments`);
      console.log(`- http://localhost:${port}/api/admin/data`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer(3000); 