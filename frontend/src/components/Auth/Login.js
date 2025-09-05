import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api';

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', formData);
      if (data.user) {
        localStorage.setItem('token', data.token); // Save token to localStorage
        localStorage.setItem('userId', data.user._id); // Save userId to localStorage
        setIsAuthenticated(true); // Notify App.js about login status change
        alert('Login successful');
        navigate('/'); // Redirect to home page (PostFeed)
      } else {
        alert('Login failed: User data missing');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {/* Register Button */}
        <p>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            Register Now
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;