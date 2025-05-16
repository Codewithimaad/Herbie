// src/App.jsx
import { Routes, Route } from 'react-router-dom';
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
import AboutUs from './pages/AboutUs'
import './index.css'
import Disclaimer from './pages/Disclaimer';
import RefundPolicy from './pages/RefundPolicy';
import CustomerService from './pages/CustomerService';
import ShippingHandling from './pages/ShippingHandling';
import FAQsPage from './pages/FaQs';
import Contact from './pages/Contact';


function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-white">
        <HeaderText />
        <Navbar />
        <main className="flex-1 container mx-auto p-4">
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
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
