import { useState } from 'react';

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Types
interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface PaymentDetails {
  method: 'card' | 'upi';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

// State hooks
const [userDetails, setUserDetails] = useState<UserDetails>({
  name: '',
  email: '',
  phone: '',
  address: ''
});

const [cart, setCart] = useState<CartItem[]>([]);
const [showPayment, setShowPayment] = useState(false);
const [showConfirmation, setShowConfirmation] = useState(false);
const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
  method: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  upiId: ''
});

// Helper functions
const getTotalPrice = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

const showNotification = (message: string, type: 'success' | 'error') => {
  // Implementation of notification display
  console.log(`${type}: ${message}`);
};

const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // First create the order
    const orderData = {
      customerName: userDetails.name,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: getTotalPrice(),
      customerDetails: {
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address
      }
    };

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const order = await orderResponse.json();

    // Then process the payment
    const paymentData = {
      orderId: order.id,
      amount: getTotalPrice(),
      method: paymentDetails.method,
      details: paymentDetails.method === 'card' ? {
        cardNumber: paymentDetails.cardNumber,
        cardExpiry: paymentDetails.cardExpiry,
        cardCvv: paymentDetails.cardCvv
      } : {
        upiId: paymentDetails.upiId
      }
    };

    const paymentResponse = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (!paymentResponse.ok) {
      throw new Error('Payment failed');
    }

    const paymentResult = await paymentResponse.json();

    if (paymentResult.success) {
      setShowPayment(false);
      setShowConfirmation(true);
      // Reset cart and payment details
      setCart([]);
      setPaymentDetails({
        method: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        upiId: ''
      });
      showNotification('Payment successful! Your order has been placed.', 'success');
    } else {
      throw new Error(paymentResult.message || 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    showNotification(error.message || 'Payment failed. Please try again.', 'error');
  }
}; 