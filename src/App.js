import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './style-v2.css';

const API = 'https://student-backend-wm44.onrender.com'; // backend URL

function App() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API}/signup`, formData);
      setMessage(res.data.message);
    } catch {
      setMessage('Signup failed.');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, formData);
      setMessage(res.data.message);
      if (res.data.success) setLoggedIn(true);
    } catch {
      setMessage('Login failed.');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setFormData({ username: '', password: '' });
    setMessage('');
    setCartItems([]);
    setShowCart(false);
  };

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveFromCart = (i) => {
    const updated = [...cartItems];
    updated.splice(i, 1);
    setCartItems(updated);
  };

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);
  const gst = +(totalAmount * 0.18).toFixed(2);
  const grandTotal = +(totalAmount + gst).toFixed(2);

  const handleBuyNow = async () => {
    if (!cartItems.length) return alert('Cart is empty!');

    try {
      const res = await axios.post(`${API}/order`, {
        username: formData.username,
        items: cartItems,
        total: totalAmount,
        gst,
        grandTotal
      });
      alert(res.data.message);
      setCartItems([]);
      setShowCart(false);
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  return (
    <Router>
      {loggedIn ? (
        <>
          <div className="navbar">
            <button className="welcome-btn">Welcome, {formData.username}</button>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/page2">Next Page</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="nav-actions">
              <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
                Cart ({cartItems.length})
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {showCart && (
            <div className="cart-dropdown">
              <h3>Your Cart</h3>
              {cartItems.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <>
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="cart-item">
                      <p>{item.name} — ₹{item.price}</p>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <hr />
                  <p>Total: ₹{totalAmount}</p>
                  <p>GST (18%): ₹{gst}</p>
                  <h4>Grand Total: ₹{grandTotal}</h4>
                  <button className="buy-now-btn" onClick={handleBuyNow}>
                    Buy Now
                  </button>
                </>
              )}
            </div>
          )}

          <Routes>
            <Route path="/" element={<HomePage handleAddToCart={handleAddToCart} />} />
            <Route path="/page2" element={<NextPage handleAddToCart={handleAddToCart} />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </>
      ) : (
        <LoginPage
          formData={formData}
          handleChange={handleChange}
          handleSignup={handleSignup}
          handleLogin={handleLogin}
          message={message}
        />
      )}
    </Router>
  );
}

const HomePage = ({ handleAddToCart }) => {
  const products = [
    { name: "Men's Shirt", price: 999, image: '/images/shopping1.webp' },
    { name: "Men's Shirt", price: 999, image: '/images/shopping2.webp' },
    { name: "Casual Shirt", price: 399, image: '/images/download3.webp' },
    { name: "Saree", price: 1999, image: '/images/saree1.jpeg' },
    { name: "Saree", price: 1999, image: '/images/saree2.jpeg' },
    { name: "Designer Dress", price: 4999, image: '/images/saree3.jpeg' },
    { name: "Shoes", price: 1500, image: '/images/shoes.jpeg' },
    { name: "Handbag", price: 2500, image: '/images/hand.jpeg' },
    { name: "Smart Watch", price: 3499, image: '/images/watch.jpeg' }
  ];

  return (
    <div className="products">
      <h2>Clothing & Accessories</h2>
      <div className="product-list">
        {products.map((item, index) => (
          <div className="product-card" key={index}>
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NextPage = ({ handleAddToCart }) => {
  const products = [
    { name: "Apple Mobile", price: 55000, image: '/images/apple.webp' },
    { name: "Nothing Mobile", price: 30000, image: '/images/ntg.jpeg' },
    { name: "Samsung Mobile", price: 25000, image: '/images/samsung.webp' },
    { name: "MacBook", price: 80000, image: '/images/Mac.jpeg' },
    { name: "Dell Laptop", price: 55000, image: '/images/Dell.webp' },
    { name: "HP Laptop", price: 65000, image: '/images/HP.webp' },
    { name: "JBL Bag", price: 2999, image: '/images/jbl.jpeg' },
    { name: "Boult Bag", price: 1299, image: '/images/boult.jpeg' },
    { name: "Boat Bag", price: 1599, image: '/images/boat.jpeg' }
  ];

  return (
    <div className="products">
      <h2>Electronics & Gadgets</h2>
      <div className="product-list">
        {products.map((item, index) => (
          <div className="product-card" key={index}>
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => (
  <div className="contact">
    <h2>Contact Us</h2>
    <p>For any queries, contact: support@example.com</p>
  </div>
);

const LoginPage = ({ formData, handleChange, handleSignup, handleLogin, message }) => (
  <div className="login">
    <h2>Login / Signup</h2>
    <input
      type="text"
      name="username"
      placeholder="Username"
      value={formData.username}
      onChange={handleChange}
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
    />
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
    </div>
    <p>{message}</p>
  </div>
);

export default App;
