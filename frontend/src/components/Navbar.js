import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show confirmation prompt
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Update authentication state in App component
      setIsAuthenticated(false);
      
      // Navigate to login page
      navigate('/login');
      
      // Optional: Show logout success message
      alert('Logged out successfully!');
    }
    // If user clicks "No", nothing happens and they stay on current page
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Switter</div>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        
        {/* Show Create Post and Profile only when authenticated */}
        {isAuthenticated && (
          <>
            <li><Link to="/create-post" style={styles.link}>Create Post</Link></li>
            <li><Link to="/profile" style={styles.link}>Profile</Link></li>
          </>
        )}
        
        {/* Conditional Login/Logout */}
        <li>
          {isAuthenticated ? (
            <span onClick={handleLogout} style={styles.link}>
              Logout
            </span>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default Navbar;