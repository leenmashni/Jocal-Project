import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Navbar.css";
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));

    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "top"}`}>
      <div className="navbar-content">
        
          <Link to="/" className="navbar-logo-wrapper">
          <img src={logo} alt="Jocal Logo" className="navbar-logo" />
        </Link>
       

        

        <nav className="main-nav">
          <HashLink smooth to="/#our-story" className="nav-link">Our Story</HashLink>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="login-btn">Logout</button>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}

          <Link to="/wishlist" className="wishlist-btn" title="Wishlist">
            <svg className="wishlist-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                  C13.09 3.81 14.76 3 16.5 3
                  19.58 3 22 5.42 22 8.5
                  c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#e74c3c"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
