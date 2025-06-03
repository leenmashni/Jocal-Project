import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeaturedDeals.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const FeaturedDeals = () => {
  const [featuredData, setFeaturedData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add', 'edit', 'delete'
  const [formData, setFormData] = useState({ title: "", promo: "", video: "" });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showMenuIndex, setShowMenuIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Invalid token");
      }
    }
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/deals");
      setFeaturedData(res.data);
    } catch (err) {
      console.error("Error fetching deals:", err);
    }
  };

  const openModal = (type, index = null) => {
    setModalType(type);
    setSelectedIndex(index);
    setShowForm(true);
    if (type === "edit" && index !== null) {
      const deal = featuredData[index];
      setFormData({ title: deal.title, promo: deal.promo, video: deal.video });
    } else {
      setFormData({ title: "", promo: "", video: "" });
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setModalType("");
    setSelectedIndex(null);
    setFormData({ title: "", promo: "", video: "" });
    setShowMenuIndex(null);
  };

  const submitForm = async () => {
    const { title, promo, video } = formData;
    if (!title || !promo || !video) return;
    try {
      if (modalType === "add") {
        const res = await axios.post("http://localhost:5000/api/deals", formData);
        setFeaturedData([...featuredData, res.data]);
      } else if (modalType === "edit" && selectedIndex !== null) {
        const id = featuredData[selectedIndex]._id;
        const res = await axios.put(`http://localhost:5000/api/deals/${id}`, formData);
        const updated = [...featuredData];
        updated[selectedIndex] = res.data;
        setFeaturedData(updated);
      }
      closeModal();
    } catch (err) {
      console.error("Error submitting deal:", err);
    }
  };

  const handleRemove = async () => {
    try {
      const id = featuredData[selectedIndex]._id;
      await axios.delete(`http://localhost:5000/api/deals/${id}`);
      setFeaturedData(featuredData.filter((_, i) => i !== selectedIndex));
      closeModal();
    } catch (err) {
      console.error("Error deleting deal:", err);
    }
  };

  return (
    <section className="featured-deals">
      <h2>Top Deals</h2>

      {isAdmin && (
        <button onClick={() => openModal("add")} className="add-deal-btn">
          + Add Deal
        </button>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            {modalType === "delete" ? (
              <>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this deal?</p>
                <button onClick={handleRemove}>Yes, Delete</button>
              </>
            ) : (
              <>
                <h3>{modalType === "edit" ? "Edit Deal" : "Add New Deal"}</h3>
                <input type="text" placeholder="Title" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <input type="text" placeholder="Promo Code or %"
                  value={formData.promo} onChange={(e) => setFormData({ ...formData, promo: e.target.value })} />
                <input type="text" placeholder="Video Path"
                  value={formData.video} onChange={(e) => setFormData({ ...formData, video: e.target.value })} />
                <button onClick={submitForm}>Submit</button>
              </>
            )}
          </div>
        </div>
      )}

      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        navigation
        modules={[Navigation]}
        className="deals-swiper"
      >
        {featuredData.map((deal, index) => (
          <SwiperSlide key={deal._id}>
            <div className="gucci-card">
              {isAdmin && (
                <div className="edit-controls">
                  <button onClick={() => setShowMenuIndex(index)}>⋮</button>
                  {showMenuIndex === index && (
                    <div className="action-menu">
                      <button onClick={() => openModal("edit", index)}>Edit</button>
                      <button onClick={() => openModal("delete", index)}>Remove</button>
                    </div>
                  )}
                </div>
              )}
              <div className="media-container">
                {deal.video ? (
                  <video src={deal.video} autoPlay muted loop playsInline className="gucci-media" />
                ) : (
                  <img src={deal.gallery?.[0]} alt={deal.title} className="gucci-media" />
                )}
              </div>
              <div className="gucci-info">
                <h3>{deal.title}</h3>
                {deal.promo && (
                  <p>{deal.promo.includes('%') ? (
                    <strong>{deal.promo}</strong>
                  ) : <>Use Code: <strong>{deal.promo}</strong></>}</p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedDeals;
