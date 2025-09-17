import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiUserPlus, FiUserMinus, FiMail, FiMapPin, FiGlobe, FiCalendar } from 'react-icons/fi';
import API from '../../api';
import './UserProfile.css';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await API.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedUser = profileResponse.data;
        setUser(fetchedUser);
        setIsFollowing(fetchedUser.followers?.some(followerId => followerId === currentUserId));

        // Fetch user posts
        try {
          const postsResponse = await API.get(`/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUserPosts(postsResponse.data);
        } catch (postsError) {
          console.log('Posts not available yet');
          setUserPosts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    try {
      await API.put(`/users/${userId}/follow`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsFollowing(true);
      setUser((prevUser) => ({
        ...prevUser,
        followers: [...(prevUser.followers || []), currentUserId],
      }));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await API.put(`/users/${userId}/unfollow`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsFollowing(false);
      setUser((prevUser) => ({
        ...prevUser,
        followers: prevUser.followers.filter(followerId => followerId !== currentUserId),
      }));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...(post.likes || []), currentUserId] }
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
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: (post.likes || []).filter((likeId) => likeId !== currentUserId) }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="page-container pt-20">
        <div className="loading-container">
          <div className="loading-spinner-lg" />
          <p className="text-lg text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container pt-20">
        <div className="error-container text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User not found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pt-20">
      <div className="container">
        <motion.div
          className="user-profile-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header Card */}
          <motion.div className="card-base card-hover profile-header-card" variants={cardVariants}>
            <div className="cover-photo-section">
              {user.coverPic ? (
                <img 
                  src={`http://localhost:5000${user.coverPic}`} 
                  alt="Cover" 
                  className="cover-photo" 
                />
              ) : (
                <div className="cover-gradient" />
              )}
              <div className="profile-photo-wrapper">
                {user.profilePic ? (
                  <motion.img 
                    src={`http://localhost:5000${user.profilePic}`} 
                    alt="Profile" 
                    className="profile-photo"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <motion.div 
                    className="profile-photo-placeholder avatar-base avatar-2xl avatar-gradient"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="profile-info-section">
              <div className="profile-actions">
                {currentUserId !== userId && (
                  <>
                    <motion.button
                      className={`btn-base ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isFollowing ? (
                        <>
                          <FiUserMinus size={16} />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <FiUserPlus size={16} />
                          <span>Follow</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      className="btn-base btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiMail size={16} />
                      <span>Message</span>
                    </motion.button>
                  </>
                )}
              </div>

              <h1 className="profile-name">{user.username || 'Unknown User'}</h1>
              <p className="profile-username">@{user.username?.toLowerCase()}</p>

              {user.bio && (
                <p className="profile-bio">{user.bio}</p>
              )}

              <div className="profile-meta">
                {user.location && (
                  <div className="meta-item">
                    <FiMapPin size={14} />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="meta-item">
                    <FiGlobe size={14} />
                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="meta-item">
                  <FiCalendar size={14} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{userPosts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.followers?.length || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.following?.length || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs Section */}
          <motion.div className="profile-tabs card-base" variants={cardVariants}>
            {['posts', 'media', 'likes'].map((tab) => (
              <motion.button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Posts Grid */}
          <motion.div className="user-posts-section" variants={cardVariants}>
            {activeTab === 'posts' && (
              <div className="user-posts-grid">
                <AnimatePresence>
                  {userPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      className="card-base card-hover user-post-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="post-header">
                        <span className="post-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="post-content">
                        <p>{post.content}</p>
                        {post.file && (
                          <motion.img
                            src={`http://localhost:5000${post.file}`}
                            alt="Post content"
                            className="post-image"
                            whileHover={{ scale: 1.02 }}
                          />
                        )}
                      </div>

                      <div className="post-actions">
                        <motion.button
                          className={`post-action-btn ${(post.likes || []).includes(currentUserId) ? 'liked' : ''}`}
                          onClick={() => (post.likes || []).includes(currentUserId) ? handleUnlike(post._id) : handleLike(post._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiHeart size={16} />
                          <span>{(post.likes || []).length}</span>
                        </motion.button>

                        <motion.button
                          className="post-action-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiMessageCircle size={16} />
                          <span>{(post.comments || []).length}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="media-grid">
                {userPosts.filter(post => post.file).map((post, index) => (
                  <motion.div
                    key={post._id}
                    className="media-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={`http://localhost:5000${post.file}`}
                      alt="Media content"
                      className="media-image"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {userPosts.length === 0 && (
              <div className="empty-state text-center">
                <p className="text-gray-600">No posts yet</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserProfile;