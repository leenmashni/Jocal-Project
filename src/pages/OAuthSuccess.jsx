import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token and user info from URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const username = params.get('username');
    const email = params.get('email');

    if (token && userId) {
      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      
      // Redirect to home page
      navigate('/');
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Logging you in...</h2>
      <p>Please wait while we complete the authentication process.</p>
    </div>
  );
}

export default OAuthSuccess;
