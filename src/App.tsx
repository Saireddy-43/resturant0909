import { useState, useEffect } from 'react';
import { menuData } from './data/menuData';
import { Menu, ChevronLeft, ChevronRight, ShoppingCart, X, Calendar, CreditCard, QrCode, User, LogOut } from 'lucide-react';
import FoodBooking from './components/FoodBooking';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: ''
  });
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showProfile, setShowProfile] = useState(false);

  const selectedMenu = menuData.find((menu: MenuDay) => menu.day === selectedDay);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('userDetails');
    if (savedUser) {
      setUserDetails(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);

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

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBooking(false);
    showNotification('Table booked successfully! We will contact you shortly.', 'success');
    setBookingDetails({ date: '', time: '', guests: '2', name: '', phone: '' });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
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
    setTimeout(() => setShowConfirmation(false), 5000); // Hide confirmation after 5 seconds
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowPayment(true);
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
    return day.toLowerCase() === 'friday';
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
            <div className="flex justify-center mb-4">
              <img src="https://i.imgur.com/8B6mXUg.png" alt="Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Spice Symphony</h1>
            <p className="text-lg text-gray-600">Welcome back!</p>
            <p className="text-sm text-gray-500 mt-2">Experience the finest Indian cuisine</p>
          </div>
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
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-red-200 group-hover:text-red-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
                Sign In
              </button>
            </div>
          </form>
          <div className="text-center mt-6 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="h-px w-16 bg-gray-200"></span>
              <p className="text-sm text-gray-400">Secure Login</p>
              <span className="h-px w-16 bg-gray-200"></span>
            </div>
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Spice Symphony</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-gray-600 hover:text-gray-900"
            >
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Food Booking System</h2>
          <FoodBooking />
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;