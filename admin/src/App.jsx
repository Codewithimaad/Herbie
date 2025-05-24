import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import MainContent from './components/MainContent';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import { EditProduct } from './pages/EditProduct';
import OrdersPage from './pages/OrdersPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="" element={<Dashboard />}>
            <Route index element={<MainContent />} />
            <Route path="main" element={<MainContent />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<Products />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="orders" element={<OrdersPage />} />



          </Route>
        </Routes>
      </main>
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
  );
}

export default App;