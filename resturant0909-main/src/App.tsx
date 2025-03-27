import { useState, useEffect } from 'react';
import { menuData } from './data/menuData';
import { Menu, ChevronLeft, ChevronRight, ShoppingCart, X, Calendar, CreditCard, QrCode, User, LogOut } from 'lucide-react';
import TableLayout from './components/TableLayout';

// API endpoints
const API_URL = 'https://restaurant-api-sb1.onrender.com/api';

// API functions
const createBooking = async (bookingData: any) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

const createOrder = async (orderData: any) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  customerDetails: {
    email: string;
    phone: string;
    address: string;
  };
  timestamp: string;
  status: string;
}

interface MenuDay {
  day: string;
  cuisine: string;
  items: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

interface PaymentDetails {
  method: 'card' | 'upi';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function App() {
  const [selectedDay, setSelectedDay] = useState<string>(menuData[0].day);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    phone: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });
  const [showLogin, setShowLogin] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: ''
  });
  const [signUpDetails, setSignUpDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const selectedMenu = menuData.find((menu: MenuDay) => menu.day === selectedDay);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('userDetails');
    if (savedUser) {
      setUserDetails(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);

  useEffect(() => {
    // Fetch orders when component mounts
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (!showLogin) {
      fetchOrders();
    }
  }, [showLogin]);

  const getOrderStatus = (order: Order) => {
    const orderDate = new Date(order.timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return 'Recent';
    } else {
      return 'Past';
    }
  };

  const handlePrevDay = () => {
    const currentIndex = menuData.findIndex((menu: MenuDay) => menu.day === selectedDay);
    const prevIndex = (currentIndex - 1 + menuData.length) % menuData.length;
    setSelectedDay(menuData[prevIndex].day);
  };

  const handleNextDay = () => {
    const currentIndex = menuData.findIndex((menu: MenuDay) => menu.day === selectedDay);
    const nextIndex = (currentIndex + 1) % menuData.length;
    setSelectedDay(menuData[nextIndex].day);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showNotification('Item added to cart!', 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    showNotification('Item removed from cart', 'success');
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleTableSelect = (tableNumber: string) => {
    setSelectedTables(prev => {
      if (prev.includes(tableNumber)) {
        return prev.filter(t => t !== tableNumber);
      }
      return [...prev, tableNumber];
    });
  };

  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      name: bookingDetails.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      guests: parseInt(bookingDetails.guests),
      phone: bookingDetails.phone,
      tableNumbers: selectedTables,
    };

    try {
      await createBooking(bookingData);

      // Update booked tables in localStorage
      const bookedTables = JSON.parse(localStorage.getItem('bookedTables') || '{}');
      selectedTables.forEach(table => {
        bookedTables[table] = {
          isBooked: true,
          date: bookingDetails.date,
          time: bookingDetails.time
        };
      });
      localStorage.setItem('bookedTables', JSON.stringify(bookedTables));

      setShowBooking(false);
      showNotification('Table booked successfully! We will contact you shortly.', 'success');
      
      // Reset form
      setBookingDetails({ date: '', time: '', guests: '2', name: '', phone: '' });
      setSelectedTables([]);
    } catch (error) {
      showNotification('Failed to book table. Please try again.', 'error');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

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
      },
      timestamp: new Date().toISOString(),
      status: 'Confirmed'
    };

    try {
      const response = await createOrder(orderData);
      setOrders(prevOrders => [response, ...prevOrders]);
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
      setTimeout(() => {
        setShowConfirmation(false);
        showNotification('Thank you for your order! You can view it in your order history.', 'success');
      }, 3000);
    } catch (error) {
      showNotification('Failed to process payment. Please try again.', 'error');
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app, this would be an API call
    if (loginDetails.username && loginDetails.password) {
      setShowLogin(false);
      // Save user details
      const newUserDetails = {
        name: loginDetails.username,
        email: `${loginDetails.username}@example.com`,
        phone: '',
        address: ''
      };
      setUserDetails(newUserDetails);
      localStorage.setItem('userDetails', JSON.stringify(newUserDetails));
      showNotification('Login successful!', 'success');
    } else {
      showNotification('Please enter both username and password', 'error');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!signUpDetails.username || !signUpDetails.email || !signUpDetails.password || !signUpDetails.confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    if (signUpDetails.password !== signUpDetails.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    // In a real app, this would be an API call to create the user
    const newUserDetails = {
      name: signUpDetails.username,
      email: signUpDetails.email,
      phone: '',
      address: ''
    };
    // Don't set user details or remove showLogin here
    // Just reset the form and switch to login view
    setIsSignUp(false);
    setSignUpDetails({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    showNotification('Account created successfully! Please sign in.', 'success');
  };

  const handleLogout = () => {
    setShowLogin(true);
    setUserDetails({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    localStorage.removeItem('userDetails');
    showNotification('Logged out successfully', 'success');
  };

  const updateUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    setShowProfile(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const isItemAvailable = (day: string) => {
    return day.toLowerCase() === 'thursday';
  };

  // Add this CSS class for the text logo animation
  const logoStyle = {
    fontFamily: "'Playfair Display', serif",
    position: 'relative' as const,
    display: 'inline-block',
    padding: '0.5rem',
    background: 'linear-gradient(45deg, #ef4444, #dc2626)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  };

  const logoIconStyle = {
    color: '#dc2626',
    fontSize: '1.5em',
    marginRight: '0.2em',
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-400 rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-red-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-300 rounded-full"></div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-8 relative z-10 border border-red-100">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2" style={logoStyle}>
                  <span style={logoIconStyle}>🔥</span>
                  Spice
                </div>
                <div className="text-4xl font-semibold" style={logoStyle}>Symphony</div>
              </div>
            </div>
            <p className="text-lg text-gray-600 mt-4">{isSignUp ? 'Create Account' : 'Welcome back!'}</p>
            <p className="text-sm text-gray-500 mt-2">Experience the finest Indian cuisine</p>
          </div>

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="mt-8 space-y-6">
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-red-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={signUpDetails.username}
                      onChange={(e) => setSignUpDetails({ ...signUpDetails, username: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={signUpDetails.email}
                      onChange={(e) => setSignUpDetails({ ...signUpDetails, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={signUpDetails.password}
                      onChange={(e) => setSignUpDetails({ ...signUpDetails, password: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={signUpDetails.confirmPassword}
                      onChange={(e) => setSignUpDetails({ ...signUpDetails, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-red-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginDetails.username}
                      onChange={(e) => setLoginDetails({ ...loginDetails, username: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginDetails.password}
                      onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="text-center mt-6 space-y-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            <div className="flex items-center justify-center space-x-2">
              <span className="h-px w-16 bg-gray-200"></span>
              <p className="text-sm text-gray-400">Secure {isSignUp ? 'Sign Up' : 'Login'}</p>
              <span className="h-px w-16 bg-gray-200"></span>
            </div>
            <p className="text-sm text-gray-500">
              By {isSignUp ? 'signing up' : 'signing in'}, you agree to our{' '}
              <a href="#" className="text-red-600 hover:text-red-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-red-600 hover:text-red-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with enhanced styling */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="text-2xl font-bold" style={logoStyle}>
                    <span style={logoIconStyle}>🔥</span>
                    Spice Symphony
                  </div>
                </div>
              </div>
              <nav className="hidden md:flex space-x-4">
                {menuData.map((menu: MenuDay) => (
                  <button
                    key={menu.day}
                    onClick={() => setSelectedDay(menu.day)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedDay === menu.day
                        ? 'bg-red-600 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {menu.day}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{userDetails.name}</span>
              </button>
              <button
                onClick={() => setShowOrders(true)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setShowBooking(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Table
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Cart ({cart.length})</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with enhanced styling */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Day navigation with enhanced styling */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={handlePrevDay}
            className="flex items-center text-gray-600 hover:text-red-600 transition-all duration-200 transform hover:scale-105"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="ml-2 font-medium">Previous Day</span>
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{selectedMenu?.cuisine}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isItemAvailable(selectedMenu?.day || '') 
                ? "Today's Special Menu - Available Now!"
                : "Menu Preview - Available on Thursday"}
            </p>
          </div>
          <button
            onClick={handleNextDay}
            className="flex items-center text-gray-600 hover:text-red-600 transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2 font-medium">Next Day</span>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Menu grid with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedMenu?.items.map((item: MenuItem) => {
            const available = isItemAvailable(selectedMenu.day);
            return (
              <div
                key={item.id}
                className={`menu-item bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  !available ? 'opacity-90' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {!available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center bg-red-600 bg-opacity-90 px-6 py-3 rounded-lg shadow-lg">
                        <span className="text-white text-lg font-semibold block">
                          Not Available
                        </span>
                        <span className="text-white text-sm block mt-1">
                          Available on Thursday
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-red-600 font-semibold">₹{item.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`text-sm ${available ? 'text-green-600' : 'text-red-600'}`}>
                        {available ? 'Available Now' : 'Available Thursday'}
                      </span>
                    </div>
                    <button
                      onClick={() => available && addToCart(item)}
                      disabled={!available}
                      className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                        available
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {available ? 'Add to Cart' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-100 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-100 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">₹{getTotalPrice()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Book a Table</h2>
              <button onClick={() => setShowBooking(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleBookTable} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDetails.date}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                      className="w-full p-2 border rounded"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Time</label>
                    <select
                      required
                      value={bookingDetails.time}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select time</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="21:00">9:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Number of Guests</label>
                    <select
                      value={bookingDetails.guests}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, guests: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                <div>
                  {bookingDetails.date && bookingDetails.time && (
                    <TableLayout
                      selectedTables={selectedTables}
                      onTableSelect={handleTableSelect}
                      date={bookingDetails.date}
                      time={bookingDetails.time}
                    />
                  )}
                  {!bookingDetails.date || !bookingDetails.time ? (
                    <div className="p-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                      Please select a date and time to view available tables
                    </div>
                  ) : null}
                </div>
              </div>
              <button
                type="submit"
                disabled={!selectedTables.length}
                className={`w-full py-3 rounded-md transition-colors ${
                  selectedTables.length
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedTables.length ? 'Book Selected Tables' : 'Please Select Tables'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Payment</h2>
              <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-red-600">₹{getTotalPrice()}</span>
              </div>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                    paymentMethod === 'card' ? 'bg-red-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                    paymentMethod === 'upi' ? 'bg-red-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span>UPI</span>
                </button>
              </div>
            </div>
            <form onSubmit={handlePayment} className="space-y-4">
              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentDetails.cardExpiry}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={paymentDetails.cardCvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvv: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    required
                    placeholder="username@upi"
                    value={paymentDetails.upiId}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Pay ₹{getTotalPrice()}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={updateUserDetails} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Delivery Address</label>
                <textarea
                  value={userDetails.address}
                  onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Successful!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your order has been placed successfully. You can view it in your order history.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setShowOrders(true);
                  }}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                >
                  View Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slideIn`}
        >
          {notification.message}
        </div>
      )}

      {/* Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Orders</h2>
                <button onClick={() => setShowOrders(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getOrderStatus(order) === 'Recent' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getOrderStatus(order)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;