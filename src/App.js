import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './style-v2.css';

const API = 'https://student-backend-wm44.onrender.com';

function App() {
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [address, setAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  

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
    setFormData({ username: '', password: '', name: '', email: '' });
    setMessage('');
    setCartItems([]);
    setShowCart(false);
    setAddress('');
  };

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const total = cartItems.reduce((sum, i) => sum + i.price, 0);
  const gst = +(total * 0.18).toFixed(2);
  const grandTotal = +(total + gst).toFixed(2);

  const handleBuyNow = () => {
    if (cartItems.length === 0) return alert('Cart is empty!');
    setShowAddressForm(true);
  };

  const submitOrderWithAddress = async () => {
    if (!address.trim()) {
      alert('Please enter your address');
      return;
    }

    try {
      const res = await axios.post(`${API}/order`, {
        username: formData.username,
        address,
        items: cartItems,
        total,
        gst,
        grandTotal
      });

      alert(res.data.message);
      setCartItems([]);
      setAddress('');
      setShowCart(false);
      setShowAddressForm(false);
    } catch {
      alert('Order failed.');
    }
  };

  const handleProfileSubmit = () => {
    alert('Profile saved!');
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
              <Link to="/profile">Profile</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="nav-actions">
              <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
                Cart ({cartItems.length})
              </button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {showCart && (
            <div className="cart-dropdown">
              <h3>Your Cart</h3>
              {cartItems.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <>
                  {cartItems.map((item, i) => (
                    <div key={i} className="cart-item">
                      <p>{item.name} — ₹{item.price}</p>
                      <button className="remove-btn" onClick={() => handleRemoveFromCart(i)}>Remove</button>
                    </div>
                  ))}
                  <hr />
                  <p>Total: ₹{total}</p>
                  <p>GST (18%): ₹{gst}</p>
                  <h4>Grand Total: ₹{grandTotal}</h4>
                  <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
                </>
              )}
            </div>
          )}

          {showAddressForm && (
            <div className="cart-dropdown">
              <h3>Enter Shipping Address</h3>
              <textarea
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                style={{ width: '100%', borderRadius: '8px', padding: '10px' }}
              />
              <br />
              <button className="buy-now-btn" onClick={submitOrderWithAddress}>Submit Order</button>
            </div>
          )}

          <Routes>
            <Route path="/" element={<HomePage handleAddToCart={handleAddToCart} />} />
            <Route path="/page2" element={<NextPage handleAddToCart={handleAddToCart} />} />
            <Route path="/profile" element={
              <ProfilePage
                formData={formData}
                handleChange={handleChange}
                handleProfileSubmit={handleProfileSubmit}
              />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </>
      ) : (
        <LoginPage
          formData={formData}
          handleChange={handleChange}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          message={message}
        />
      )}
    </Router>
  );
}

const LoginPage = ({ formData, handleChange, handleLogin, handleSignup, message }) => (
  <div className="login-container">
    <div className="login-form">
      <h2>Login / Signup</h2>
      <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
      <p className="message">{message}</p>
    </div>
  </div>
);

const ProfilePage = ({ formData, handleChange, handleProfileSubmit }) => (
  <div className="profile-page">
    <h2>User Profile</h2>
    <label>
      Full Name:
      <input type="text" name="name" value={formData.name} onChange={handleChange} />
    </label>
    <label>
      Email:
      <input type="email" name="email" value={formData.email} onChange={handleChange} />
    </label>
    <button className="cart-btn" onClick={handleProfileSubmit}>Save Profile</button>
  </div>
);

const HomePage = ({ handleAddToCart }) => {
  const products = [
   { name: "Men's Shirt", price: 999, image: '/images/shopping1.webp', specs: "Cotton, Slim Fit, Navy Blue" },
    { name: "Men's Shirt", price: 999, image: '/images/shopping2.webp', specs: "Formal, Full Sleeve, Easy Iron" },
    { name: "Casual Shirt", price: 399, image: '/images/download3.webp', specs: "Polyester, Lightweight, Printed" },
    { name: "Saree", price: 1999, image: '/images/saree1.jpeg', specs: "Silk Blend, Traditional Look" },
    { name: "Saree", price: 1999, image: '/images/saree2.jpeg', specs: "Chiffon, Party Wear, Dry Clean" },
    { name: "Designer Dress", price: 4999, image: '/images/saree3.jpeg', specs: "Modern, Sleeveless, Georgette" },
    { name: "Shoes", price: 1500, image: '/images/shoes.jpeg', specs: "Sports Style, Rubber Sole, Size 6-11" },
    { name: "Handbag", price: 2500, image: '/images/hand.jpeg', specs: "Leather Finish, 3 Pockets, Tan Color" },
    { name: "Smart Watch", price: 3499, image: '/images/watch.jpeg', specs: "Bluetooth, Fitness Tracking, Waterproof" }
  ];

  return (
    <div className="products">
      <h2>Clothing & Accessories</h2>
      <div className="product-list">
        {products.map((item, i) => (
          <div key={i} className="product-card">
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <p className="specs">{item.specs}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NextPage = ({ handleAddToCart }) => {
  const electronics = [
    { name: "Apple Mobile", price: 55000, image: '/images/apple.webp', specs: "128GB, iOS 17, Dual Camera" },
    { name: "Nothing Mobile", price: 30000, image: '/images/ntg.jpeg', specs: "Glyph Interface, Snapdragon 778G+" },
    { name: "Samsung Mobile", price: 25000, image: '/images/samsung.webp', specs: "Galaxy Series, 5G, AMOLED Display" },
    { name: "MacBook", price: 80000, image: '/images/Mac.jpeg', specs: "M1, 8GB RAM, 256GB SSD" },
    { name: "Dell Laptop", price: 55000, image: '/images/Dell.webp', specs: "Intel i5, 8GB RAM, 512GB SSD" },
    { name: "HP Laptop", price: 65000, image: '/images/HP.webp', specs: "Ryzen 5, Windows 11, 1TB HDD" },
    { name: "JBL Bag", price: 2999, image: '/images/jbl.jpeg', specs: "Waterproof, Large Size, 2 Compartments" },
    { name: "Boult Bag", price: 1299, image: '/images/boult.jpeg', specs: "Laptop Compatible, Stylish Design" },
    { name: "Boat Bag", price: 1599, image: '/images/boat.jpeg', specs: "Trendy, Compact, Eco Material" }
  ];

  return (
    <div className="products">
      <h2>Electronics & Gadgets</h2>
      <div className="product-list">
        {electronics.map((item, i) => (
          <div key={i} className="product-card">
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <p className="specs">{item.specs}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => (
  <div className="contact-page">
    <h2>Contact Us</h2>
    <p>Email us at: <b>achyutk574@gmail.com</b></p>
  </div>
);

export default App;  