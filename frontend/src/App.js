import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostFeed from './components/Posts/PostFeed';
import CreatePost from './components/Posts/CreatePost';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile'; // Import the new UserProfile component
import Navbar from './components/Navbar';

function App() {
  // Use state for authentication so UI updates on login/logout
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Optional: Listen for storage changes (if multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={isAuthenticated ? <PostFeed /> : <Navigate to="/login" />} />
            <Route path="/create-post" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/:id" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} /> {/* Dynamic Profile Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;