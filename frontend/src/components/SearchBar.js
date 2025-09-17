import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../api';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.get(`/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setResults(response.data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce search
    timeoutRef.current = setTimeout(() => {
      searchUsers(value);
    }, 300);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setIsFocused(false);
    setQuery('');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <motion.div
        className={`search-wrapper ${isFocused ? 'focused' : ''}`}
        whileHover={{ scale: 1.02 }}
      >
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        {query && (
          <motion.button
            className="clear-button"
            onClick={handleClear}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <FiX size={16} />
          </motion.button>
        )}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner" />
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            className="search-results card-base"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="search-results-content">
              {results.length > 0 ? (
                <>
                  <div className="results-header">
                    <span className="results-count">
                      {results.length} user{results.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  {results.map((user, index) => (
                    <motion.div
                      key={user._id}
                      variants={resultVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/user/${user._id}`}
                        className="search-result-item"
                        onClick={handleResultClick}
                      >
                        <motion.div
                          className="result-content"
                          whileHover={{ x: 5 }}
                        >
                          <div className="result-avatar avatar-base avatar-md avatar-gradient">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="result-info">
                            <div className="result-name">{user.username}</div>
                            <div className="result-username">@{user.username?.toLowerCase()}</div>
                            {user.bio && (
                              <div className="result-bio">{user.bio}</div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="no-results">
                  <p>No users found for "{query}"</p>
                  <span className="no-results-hint">Try searching with different keywords</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;