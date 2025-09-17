import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../../api';
import './Auth.css';

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await API.post('/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth redirect function
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="floating-orb orb-3" />
      </div>
      
      <motion.div
        className="card-base auth-card animate-fade-in"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-header">
          <div className="brand-logo">
            <span className="text-gradient font-extrabold text-4xl">Switter</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {error && (
          <motion.div
            className="error-message mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="input-base input-with-icon"
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="input-base input-with-icon"
              required
            />
            <motion.button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </motion.button>
          </div>

          <motion.button
            type="submit"
            className={`btn-base btn-primary w-full ${isLoading ? 'btn-disabled' : ''}`}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FiLogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </motion.button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* UPDATED: Social buttons with inline SVG icons */}
          <div className="social-buttons">
            {/* Google Button with inline SVG */}
            <motion.button
              type="button"
              className="btn-base btn-ghost social-btn"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </motion.button>

            {/* Facebook Button with inline SVG */}
            <motion.button
              type="button"
              className="btn-base btn-ghost social-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M22.675 0H1.325C.593 0 0 .594 0 1.326v21.348C0 23.404.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.917.001c-1.504 0-1.794.715-1.794 1.76v2.309h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.404 24 22.674V1.326C24 .594 23.406 0 22.675 0z"/>
              </svg>
            </motion.button>

            {/* Apple Button with inline SVG */}
            <motion.button
              type="button"
              className="btn-base btn-ghost social-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M19.665 13.556c-.012-2.063 1.686-3.05 1.763-3.101-1.02-1.48-2.611-1.687-3.168-1.707-1.351-.136-2.646.795-3.33.795-.69 0-1.756-.776-2.89-.757-1.477.02-2.84.858-3.6 2.182-1.531 2.65-.392 6.575 1.103 8.72.74 1.08 1.618 2.29 2.768 2.25 1.123-.04 1.548-.723 2.9-.723 1.332 0 1.718.72 2.888.7 1.206-.025 1.967-1.096 2.68-2.18.844-1.212 1.19-2.39 1.206-2.45-.027-.012-2.33-.9-2.346-3.567zm-2.065-7.872c.586-.71.983-1.7.876-2.69-.847.034-1.87.567-2.48 1.277-.545.617-1.02 1.608-.894 2.55.948.073 1.921-.48 2.498-1.137z"/>
              </svg>
            </motion.button>
          </div>

          <p className="auth-link text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
