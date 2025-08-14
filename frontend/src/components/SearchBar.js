import React, { useState } from 'react';
import API from '../../api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await API.get(`/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map((user) => (
          <div key={user._id}>
            <img src={user.profilePicture} alt="Profile" width="50" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
