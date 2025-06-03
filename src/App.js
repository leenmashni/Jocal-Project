import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Item from "./pages/Item";
import Wishlist from "./pages/Wishlist";
import Contact from './pages/Contact'; 
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/forget-password';
import ResetPassword from './pages/reset-password';
import OAuthSuccess from './pages/OAuthSuccess';





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Routes>
    </Router>
  );
};

export default App;
