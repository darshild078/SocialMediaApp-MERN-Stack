import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostFeed from './components/Posts/PostFeed';
import CreatePost from './components/Posts/CreatePost';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile'; // Import the new UserProfile component
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
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
