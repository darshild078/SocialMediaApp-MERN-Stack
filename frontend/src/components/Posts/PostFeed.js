import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({}); // State for comments by post ID
  const [filter, setFilter] = useState('all'); // State for filtering posts

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleAddComment = async (postId) => {
    try {
      const { data } = await API.post(`/posts/${postId}/comment`, { text: commentTexts[postId] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: data } : post
        )
      );
      setCommentTexts({ ...commentTexts, [postId]: '' }); // Clear the input after adding a comment
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'text') {
      return !post.file; // Only text posts
    }
    if (filter === 'pictures') {
      return post.file; // Only posts with pictures
    }
    return true; // All posts
  });

  const handleCommentChange = (postId, text) => {
    setCommentTexts({ ...commentTexts, [postId]: text });
  };

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: [...post.likes, userId] } : post
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await API.put(`/posts/${postId}/unlike`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter((id) => id !== userId) }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div>
      <h2>Post Feed</h2>

      {/* Filter Controls */}
      <div style={styles.filterControls}>
        <button onClick={() => setFilter('all')} style={styles.button}>All</button>
        <button onClick={() => setFilter('text')} style={styles.button}>Text Only</button>
        <button onClick={() => setFilter('pictures')} style={styles.button}>Pictures Only</button>
      </div>

      {/* Render Filtered Posts */}
      {filteredPosts.map((post) => (
        <div key={post._id} style={styles.post}>
          <h3>
          <Link to={`/profile/${post.user?._id}`}>{post.user?.username || 'Unknown User'}</Link>
          </h3>
          <p>{post.content}</p>
          {post.file && (
            <img
              src={`http://localhost:5000${post.file}`}
              alt="Uploaded content"
              style={styles.image}
            />
          )}
          <div>
            <button onClick={() => handleLike(post._id)} style={styles.button}>👍</button>
            <button onClick={() => handleUnlike(post._id)} style={styles.button}>👎</button>
            <span>{post.likes.length} likes</span>
            <br />
            <div style={styles.commentsSection}>
              <h4>Comments</h4>
              {(post.comments || []).map((comment) => (
                <div key={comment._id} style={styles.comment}>
                  <strong>{comment.user?.username || 'User'}:</strong> {comment.text}
                </div>
              ))}
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentTexts[post._id] || ''}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                style={styles.input}
              />
              <button onClick={() => handleAddComment(post._id)} style={styles.button}>
                Comment
              </button>
            </div>
          </div>
          <small>{new Date(post.createdAt).toLocaleString()}</small>

          {post.user && post.user._id === userId && (
            <button onClick={() => handleDelete(post._id)} style={styles.deleteButton}>
              🗑️ Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  post: {
    backgroundColor: '#fff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  image: {
    maxWidth: '400px',
    marginTop: '10px',
  },
  filterControls: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#ffffff', // Blue background for visibility
    border: 'none',             // Remove border
    color: 'black',             // White text color
    padding: '10px 15px',       // Padding for size
    cursor: 'pointer',          // Pointer cursor on hover
    marginRight: '10px',        // Space between buttons
    borderRadius: '4px',        // Rounded corners
    fontSize: '16px',           // Font size for visibility
    fontWeight: 'bold',         // Bold text for better visibility
  },
  deleteButton: {
    color: 'red',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '5px 10px',
    cursor: 'pointer',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  commentsSection: {
    marginTop: '20px',
  },
  comment: {
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};


export default PostFeed;
