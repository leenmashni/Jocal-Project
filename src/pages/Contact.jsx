
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import '../styles/Contact.css';
import Footer from "../components/Footer";


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus('We Will contact with you as soon as possible!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error:', err);
      setStatus(err.response?.data?.msg || 'Error sending message.');
    }
  };

  return (
    <>
    <div className="contact-container">
      
      <Navbar />

      <div className="contact-card">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <h2>Contact Us</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
            {status && <p className="status-msg">{status}</p>}
          </form>
        </div>

        <div className="side-panel">
          <div className="panel-overlay"></div>
          <div className="panel-content">
            <h2>Let’s Talk</h2>
            <p>
              Whether you’re looking to collaborate, grow your reach, or just have a question.
              <br />
              Feel free to reach out anytime.
            </p>
            <a href="tel:+962799991234" className="contact-phone">+962 7 9999 1234</a>
          </div>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default Contact;
