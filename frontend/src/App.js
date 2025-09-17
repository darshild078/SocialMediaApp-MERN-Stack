import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthSuccess from './components/Auth/AuthSuccess';
import PostFeed from './components/Posts/PostFeed';
import CreatePost from './components/Posts/CreatePost';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 0.98 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className="app-container">
      <Router>
        <AnimatePresence mode="wait">
          {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
          
          <motion.div
            className="page-wrapper"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes>
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? 
                  <Login setIsAuthenticated={setIsAuthenticated} /> : 
                  <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/register" 
                element={
                  !isAuthenticated ? 
                  <Register setIsAuthenticated={setIsAuthenticated} /> : 
                  <Navigate to="/" replace />
                } 
              />
              
              {/* NEW: Google OAuth Success Route */}
              <Route 
                path="/auth/success" 
                element={<AuthSuccess setIsAuthenticated={setIsAuthenticated} />} 
              />
              
              <Route 
                path="/" 
                element={
                  isAuthenticated ? 
                  <PostFeed /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/create" 
                element={
                  isAuthenticated ? 
                  <CreatePost /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  isAuthenticated ? 
                  <Profile /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/user/:userId" 
                element={
                  isAuthenticated ? 
                  <UserProfile /> : 
                  <Navigate to="/login" replace />
                } 
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;
