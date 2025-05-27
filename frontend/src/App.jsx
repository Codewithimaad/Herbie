import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HeaderText from './components/HeaderText';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import AboutUs from './pages/AboutUs';
import './index.css';
import Disclaimer from './pages/Disclaimer';
import RefundPolicy from './pages/RefundPolicy';
import CustomerService from './pages/CustomerService';
import ShippingHandling from './pages/ShippingHandling';
import FAQsPage from './pages/FaQs';
import Contact from './pages/Contact';
import MyOrdersPage from './pages/MyOrdersPage';
import { useAuth } from './context/authContext';
import axios from 'axios';
import UserProfile from './pages/UserProfile';
import ReactGA from 'react-ga4';
import usePageTracking from './pages/usePageTracking';



// ✅ Initialize GA4 ONCE outside component
ReactGA.initialize('G-319XJMHJ88', {
  debug_mode: true
});


function App() {

  // To track poge View
  usePageTracking

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();




  // ✅ Google OAuth token handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          login(res.data.user, token);
          // Clean URL
          urlParams.delete('token');
          const cleanUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
          navigate(cleanUrl, { replace: true });
        } catch (err) {
          console.error('OAuth login failed', err);
        }
      };
      fetchUser();
    }
  }, [location.search, login, navigate]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-white">
        <HeaderText />
        <Navbar />
        <main className="flex-1 container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/shipping" element={<ShippingHandling />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
