import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style-v2.css';

function App() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [savedProfile, setSavedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://student-backend-wm44.onrender.com/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://student-backend-wm44.onrender.com/login', formData);
      if (res.data.success) {
        setLoggedIn(true);
        setMessage('');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (err) {
      setMessage('Error logging in');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://student-backend-wm44.onrender.com/profile', profile);
      setSavedProfile(profile);
      setProfile({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
          <div className="message">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar">
        <div className="nav-left">
          Welcome {savedProfile ? savedProfile.name : ''}
        </div>
        {savedProfile && (
          <div className="saved-profile">
            {savedProfile.name} ({savedProfile.email})
          </div>
        )}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-links">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('contact')}>Contact</button>
          <button onClick={() => setCurrentPage('next')}>Next</button>
          <button onClick={() => setCurrentPage('cart')}>Cart</button>
          <button className="logout-btn" onClick={() => setLoggedIn(false)}>Logout</button>
        </div>
      </div>

      {currentPage === 'home' && (
        <div className="product-list">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Cost:</strong> ₹{product.cost}</p>
              <button className="cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {currentPage === 'contact' && (
        <div className="contact-page">
          <h2>Contact Us</h2>
          <p>Phone: 123-456-7890</p>
          <p>Email: contact@example.com</p>
        </div>
      )}

      {currentPage === 'next' && (
        <div className="product-list">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Cost:</strong> ₹{product.cost}</p>
              <button className="cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {currentPage === 'cart' && (
        <div className="cart-dropdown">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                {item.name} - ₹{item.cost}
                <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            ))
          )}
        </div>
      )}

      {currentPage === 'profile' && (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <h2>Profile</h2>
          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <button type="submit">Save Profile</button>
        </form>
      )}
    </div>
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
