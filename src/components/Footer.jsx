import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";


const Footer = () => {
  return (

    
    <footer className="jocal-footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>Jocal</h3>
          <p>Supporting local shops across Jordan. Discover, compare, and shop smarter with Jocal.</p>
        </div>

        <div className="footer-center">
          <h4>Quick Links</h4>
          <ul>
             <li><Link to="/shop" className="footer-link">Shop</Link></li>
            <li><Link to="/#our-story" className="footer-link">Our Story</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>


            
          </ul>
        </div>

        
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Jocal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
