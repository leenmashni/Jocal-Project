import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Wishlist.css';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      setError("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch wishlist', err);
        setError('Please log in to view your wishlist.');
        setLoading(false);
      });
  }, [token]);

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="wish-wrapper">
        <div className="wish-hero">
          <div className="wish-intro">
            <h1>My Wishlist</h1>
            <p>Favorites all in one place 🌟</p>
          </div>
        </div>

        
        {!error && (
          <div className="wishlist-headline">
            <h2>❤️ Your Saved Products</h2>
            <p>Items you’ve marked to explore later.</p>
          </div>
        )}


        {/* Content Section */}
        <div className="wish-content">
          {loading && <p className="wish-msg">Loading...</p>}
          {error && <p className="wish-msg">{error}</p>}

          {!loading && !error && (
            <div className="wish-grid">
              {wishlist.length === 0 ? (
                <p className="wish-empty"></p>
              ) : (
                wishlist.map((item) => (
                  <div className="wish-card" key={item.productId}>
                    <img
                      src={item.image.replace("{width}","300") }
                     
                      alt={item.title}
                    />
                    <div className="wish-info">
                      <h4>{item.title}</h4>
                      <p className="wish-brand">{item.brand}</p>
                      <span className="wish-price">{item.price} JOD</span>
                    </div>
                    <div className="wish-buttons">
                      <button
                        className="wish-buy"
                    onClick={() => navigate(`/item/${item.productId}`)}
          
                     > Buy Now
                      </button>
                      <button
                        className="wish-remove"
                        onClick={() => removeItem(item.productId)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Wishlist;
