import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../../api';
import './PostFeed.css';

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAddComment = async (postId) => {
    if (!commentTexts[postId]?.trim()) return;
    
    try {
      const { data } = await API.post(
        `/posts/${postId}/comment`,
        { text: commentTexts[postId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: data } : post
        )
      );
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...(post.likes || []), userId] }
            : post
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
            ? { ...post, likes: (post.likes || []).filter((id) => id !== userId) }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'text') return !post.file;
    if (filter === 'pictures') return post.file;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const postVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <motion.div
            className="loading-spinner-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-gray-600 mt-4">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pt-20">
      <div className="container">
        <motion.div
          className="feed-header mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">Your Feed</h1>
          
          <div className="filter-container">
            {['all', 'text', 'pictures'].map((filterType) => (
              <motion.button
                key={filterType}
                className={`btn-base btn-sm ${filter === filterType ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(filterType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFilter size={14} />
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="posts-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                className="card-base card-hover post-card"
                variants={postVariants}
                layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                custom={index}
              >
                <div className="post-header">
                  <div className="post-user-info">
                    <motion.div 
                      className="avatar-base avatar-md avatar-gradient avatar-interactive"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span>{post.user?.username?.[0]?.toUpperCase() || 'U'}</span>
                    </motion.div>
                    <div className="post-user-details">
                      <Link 
                        to={`/user/${post.user?._id}`} 
                        className="post-username font-semibold text-gray-800 hover:text-primary-600"
                      >
                        {post.user?.username || 'Unknown User'}
                      </Link>
                      <span className="post-time text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="btn-base btn-ghost btn-sm post-menu-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiMoreHorizontal />
                  </motion.button>
                </div>

                <div className="post-content">
                  <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                  {post.file && (
                    <motion.div 
                      className="post-media"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={`http://localhost:5000${post.file}`}
                        alt="Post content"
                        className="w-full rounded-xl object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="post-actions">
                  <motion.button
                    className={`post-action-btn ${(post.likes || []).includes(userId) ? 'liked' : ''}`}
                    onClick={() => (post.likes || []).includes(userId) ? handleUnlike(post._id) : handleLike(post._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiHeart className="action-icon" />
                    <span>{(post.likes || []).length}</span>
                  </motion.button>

                  <motion.button
                    className="post-action-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMessageCircle className="action-icon" />
                    <span>{(post.comments || []).length}</span>
                  </motion.button>

                  <motion.button
                    className="post-action-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShare2 className="action-icon" />
                  </motion.button>
                </div>

                <div className="comment-section">
                  <div className="comment-input-group">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTexts[post._id] || ''}
                      onChange={(e) =>
                        setCommentTexts({
                          ...commentTexts,
                          [post._id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                      className="input-base comment-input"
                    />
                    <motion.button
                      onClick={() => handleAddComment(post._id)}
                      className={`btn-base btn-primary btn-sm ${!commentTexts[post._id]?.trim() ? 'btn-disabled' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!commentTexts[post._id]?.trim()}
                    >
                      Post
                    </motion.button>
                  </div>

                  <div className="comments-list">
                    {(post.comments || []).map((comment, idx) => (
                      <motion.div
                        key={idx}
                        className="comment-item card-base"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <span className="comment-author font-semibold text-gray-700">
                          {comment.user?.username || 'Anonymous'}
                        </span>
                        <span className="comment-text text-gray-600 ml-2">
                          {comment.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default PostFeed;