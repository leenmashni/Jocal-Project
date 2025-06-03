// src/pages/Privacy.jsx
import React from "react";
import "../styles/Privacy.css"; 
import Navbar from "../components/SearchNavbar";


const Privacy = () => {
  return (
    <>
    
    <div className="privacy-wrapper">
      <div className="privacy-card">
        <h1>Privacy Policy</h1>
        <p>Last updated: May 2025</p>

        <p>
          Welcome to Jocal, a platform dedicated to showcasing and comparing products from
          local Jordanian brands. Your privacy is important to us. This Privacy Policy outlines
          the information we collect, how we use it, and your rights.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect personal information such as your name, email, and password when you
          register on our site. Additionally, we may store your wishlist and browsing
          preferences.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide access to your wishlist and personalize your experience.</li>
          <li>To send relevant notifications if you opt-in.</li>
          <li>We do NOT collect or store payment information.</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>
          We do not sell or share your personal information with third parties. We may redirect
          you to original seller websites, but we do not transmit your personal data in that
          process.
        </p>

        <h2>4. Cookies</h2>
        <p>
          We use cookies to enhance functionality and understand user behavior anonymously.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You may contact us at any time to access, update, or delete your data from our system.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us via the contact
          page.
        </p>
      </div>
    </div>
    </>
  );
};

export default Privacy;
