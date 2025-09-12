import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
      navigate('/login');
      alert('Logged out successfully!');
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Left side - Logo */}
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>Switter</Link>
      </div>
      
      {/* Right side - All navigation items */}
      <ul style={styles.navLinks}>
        {isAuthenticated && (
          <>
            <li><Link to="/create-post" style={styles.link}>Create</Link></li>
            <li><Link to={`/profile/${currentUserId}`} style={styles.link}>Profile</Link></li>
          </>
        )}
        
        <li>
          {isAuthenticated ? (
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
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
  logoLink: {
    color: 'white',
    textDecoration: 'none',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;