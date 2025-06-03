import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import sandImage from "../assets/sand.jpg";
import FeaturedDeals from "../components/FeaturedDeals";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const categoryImages = {
  Clothing: "/images/categories/e03cafca825b48f50729cfda047bdd42.jpg",
  Cosmetics: "/images/categories/photo-1608571423902-eed4a5ad8108.avif",
  Home: "/images/categories/photo-1734107640189-4974176150f9.avif",
  Jewllery: "/images/categories/DSC01325_045b1d96-ea16-408f-a234-9beaf56fecc5.webp",
  Shoes: "/images/categories/photo-1560769629-975ec94e6a86.avif",
};

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="hero-section"
          style={{
            backgroundImage: `url(${sandImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            paddingTop: "160px",
            color: "#fff",
          }}

        >
          <br />
          <div className="hero-content">
            <div className="hero-text">
              <div className="animated-heading">
                {<div className="line delay1">WITH</div>}
                {<div className="line delay2">JOCAL</div>}
                <div className="line delay3 changing-word">
                  <span>SHOP</span>
                  <span>COMPARE</span>
                  <span>SEARCH</span>
                </div>

              </div>
              <p>   </p>
              <br />
              <div className="hero-buttons">
                <Link to="/shop"><button className="shop-btn">Shop Now</button></Link>
              </div>
            </div>

            <div className="hero-gallery">
              <div className="column column-up">
                <div className="scroll-track">
                  <Link to={`/shop?category=Clothing`}>
                    <img src="/images/categories/clothing.jpg" alt="Clothing" />
                  </Link>
                  <Link to={`/shop?category=Cosmetics`}>
                    <img src="/images/categories/cosmatics.avif" alt="Cosmetics" />
                  </Link>
                  <Link to={`/shop?category=Jewelry`}>
                    <img src="/images/categories/jewelery.webp" alt="Jewelry" />
                  </Link>

                  <Link to={`/shop?category=Home`}>
                    <img src="/images/categories/home.jpg" alt="Home" />
                  </Link>

                </div>
              </div>
              <div className="column column-down">
                <div className="scroll-track">
                  <Link to={`/shop?category=Clothing`}>
                    <img src="/images/categories/clothing.jpg" alt="Clothing" />
                  </Link>
                  <Link to={`/shop?category=Cosmetics`}>
                    <img src="/images/categories/cosmatics.avif" alt="Cosmetics" />
                  </Link>
                  <Link to={`/shop?category=Jewelry`}>
                    <img src="/images/categories/jewelery.webp" alt="Jewelry" />
                  </Link>

                  <Link to={`/shop?category=Home`}>
                    <img src="/images/categories/home.jpg" alt="Home" />
                  </Link>

                </div>
              </div>
            </div>
          </div>

        </section>



        <section id="our-story" className="story-card">
          <div className="card">
            <img
              src="/images/slider/photo-1564323082628-2bbd16c23a18.avif"
              alt="Local Bookstore in Jordan"
              className="card-image"
            />
            <div className="card-content">
              <h2 className="card-title">Our Story Begins Here</h2>
              <p>
                We are committed to helping you find the best deals from local websites and shops in Jordan. Our platform offers a comprehensive comparison tool that enables you to make informed purchasing decisions, ensuring you get the most out of your budget.
              </p>
              <p className="mission-statement">
                Our mission is to empower and support local businesses, especially in light of recent boycotts, by promoting homegrown alternatives and fostering community-driven growth.
              </p>
            </div>
          </div>
        </section>

        <FeaturedDeals />
        <Footer />
      </main>
    </>
  );
};

export default Home;