import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/Item.css';
import axios from "axios";
import { stripHtml } from 'string-strip-html';
import Navbar from "../components/Navbar";
import AlertMessage from "../components/AlertMessage";

const Item = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewInput, setReviewInput] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get(`http://localhost:5000/api/reviews/${id}`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to fetch product or reviews", error);
      }
    };

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        setIsLoggedIn(true);
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Invalid token");
      }
    }

    fetchProductAndReviews();
  }, [id]);

  const addReview = async () => {
    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    if (selectedRating === 0) {
      alert("Please select a rating (1-5 stars)");
      return;
    }

    if (reviewInput.trim()) {
      try {
        // Decode token to get userId
        const decoded = JSON.parse(atob(token.split('.')[1]));

        const newReview = {
          productId: id,
          rating: selectedRating,
          comment: reviewInput
        };

        // Add the review
        await axios.post('http://localhost:5000/api/reviews', newReview, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch updated reviews
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        const updatedReviews = reviewsRes.data;
        setReviews(updatedReviews);

        // Calculate new average rating
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

        // Update product directly in the database using a simple fetch
        fetch(`http://localhost:5000/api/products/${id}/rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rating: parseFloat(avgRating.toFixed(1)) })
        });

        // Update local state
        setProduct({
          ...product,
          avg_rating: parseFloat(avgRating.toFixed(1))
        });

        // Reset form
        setReviewInput('');
        setSelectedRating(0);

      } catch (error) {
        console.error("Failed to submit review", error);
      }
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      // Delete the review
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch updated reviews
      const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      const updatedReviews = reviewsRes.data;
      setReviews(updatedReviews);

      // Calculate new average rating
      const avgRating = updatedReviews.length > 0
        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
        : 0;

      // Update product with new average rating
      await axios.patch(`http://localhost:5000/api/products/${id}`, {
        avg_rating: avgRating.toFixed(1)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh product data
      const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(productRes.data);

    } catch (error) {
      console.error("Failed to delete review", error);

    }
  };


  const addToWishlist = async () => {
    if (!token) {
      setAlertMessage("Please log in to add items to your wishlist.");
      setShowAlert(true);
      return;
    }

    const wishlistItem = {
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.price
    };

    try {
      const res = await axios.post("http://localhost:5000/api/wishlist/add", wishlistItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage(res.data.message || "Added to wishlist.");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error adding to wishlist.");
      setShowAlert(true);
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (!product) return <div></div>;
  const avgRating = calculateAverageRating();

  function stripHTML(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  const convertWatanPrice = (price, brand) => {
    const brandsToConvert = ["watan", "watanpalestine", "watan palestine", "fnl"];
    return brandsToConvert.includes(brand.toLowerCase())
      ? Math.floor(price * 0.7)
      : Math.floor(price);
  };

  return (
    <div>
      <Navbar />
      {showAlert && (
        <AlertMessage message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="product-page">
        <div className="product-container">
          <div className="product-left">
            <div className="image-wrapper">
              <img src={product.image.replace("{width}", "300")} alt={product.title} className="main-image" />
              {product.on_sale && <span className="sale-tag">On Sale</span>}
            </div>

            <h2 className="product-title">{product.title}</h2>
            <div className="brand">{product.brand}</div>
            <div className="price-container">
              {product.on_sale ? (
                <>
                  <span className="original-price">
                    {convertWatanPrice(product.original_price, product.brand)} JOD
                  </span>
                  <span className="sale-price">
                    {convertWatanPrice(product.price, product.brand)} JOD
                  </span>
                </>
              ) : (
                <span className="price">
                  {convertWatanPrice(product.price, product.brand)} JOD
                </span>
              )}
            </div>
            <div className="description">
              {stripHTML(product.description)}
            </div>

            <div className="product-buttons">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Visit Original Website
              </a>
              <button className="btn-primary" onClick={addToWishlist}>
                <i className="fa-regular fa-heart"></i> Add to Wishlist
              </button>
            </div>
          </div>

          <br />

          <div className="review-section">
            <div className="averagerating">
              {"★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))}
              <span style={{ marginLeft: '8px' }}>
                {avgRating} / 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
            <br />
            <h3>Summary Review</h3>
            <p>{stripHtml(product.summary_en || "").result || "No summary available."}</p>
            <br />
            <p>{stripHtml(product.summary_ar || "").result || ""}</p>
            <br /><br />
            <h3>Reviews</h3>
            <ul className="review-list">
              {reviews.map((r, index) => (
                <li key={index}>
                  <strong>{r.userId?.username || "User"}</strong> – {"★".repeat(r.rating)}<br />
                  {r.comment}
                  {isAdmin && (
                    <button
                      onClick={() => deleteReview(r._id)}
                      style={{
                        marginLeft: '10px',
                        color: 'red',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isLoggedIn ? (
              <div className="review-form">
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        cursor: "pointer",
                        color: star <= selectedRating ? "#FFD700" : "#ccc",
                        fontSize: "20px"
                      }}
                      onClick={() => setSelectedRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Write your review..."
                />
                <button onClick={addReview} className="btn-primary">Submit</button>
              </div>
            ) : (
              <p className="login-warning">Please log in to submit a review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;