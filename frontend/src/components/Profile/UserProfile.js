import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

function UserProfile() {
  const { id } = useParams();
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
        const profileResponse = await API.get(`/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedUser = profileResponse.data;
        setUser(fetchedUser);
        setIsFollowing(fetchedUser.followers?.some(followerId => followerId === currentUserId));

        // Fetch user posts
        try {
          const postsResponse = await API.get(`/posts/user/${id}`, {
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
  }, [id, currentUserId]);

  const handleFollow = async () => {
    try {
      await API.put(`/users/${id}/follow`, null, {
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
      await API.put(`/users/${id}/unfollow`, null, {
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
          post._id === postId ? { ...post, likes: [...post.likes, currentUserId] } : post
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
            ? { ...post, likes: post.likes.filter((likeId) => likeId !== currentUserId) }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!user) return <div className="profile-error">User not found</div>;

  return (
    <div className="user-profile-container">
      {/* Cover Photo Section */}
      <div className="cover-photo">
        {user.coverPic ? (
          <img src={`http://localhost:5000${user.coverPic}`} alt="Cover" className="cover-image" />
        ) : (
          <div className="default-cover"></div>
        )}
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profilePic ? (
            <img
              src={`http://localhost:5000${user.profilePic}`}
              alt={`${user.username}'s profile`}
              className="avatar-image"
            />
          ) : (
            <div className="default-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>

        <div className="profile-actions">
          {currentUserId !== id && (
            <>
              <button className="message-btn">Message</button>
              {isFollowing ? (
                <button className="unfollow-btn" onClick={handleUnfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="follow-btn" onClick={handleFollow}>
                  Follow
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="user-info">
        <h1 className="username">{user.username}</h1>
        <p className="user-handle">@{user.username?.toLowerCase()}</p>
        {user.bio && <p className="user-bio">{user.bio}</p>}
        
        <div className="user-stats">
          <span className="stat">
            <strong>{user.following?.length || 0}</strong> Following
          </span>
          <span className="stat">
            <strong>{user.followers?.length || 0}</strong> Followers
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
        <button
          className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          Likes
        </button>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        {activeTab === 'posts' && (
          <div className="posts-list">
            {userPosts.length === 0 ? (
              <div className="no-posts">No posts yet</div>
            ) : (
              userPosts.map((post) => (
                <div key={post._id} className="profile-post">
                  <div className="post-header">
                    <div className="post-avatar">
                    </div>
                    <div className="post-user-info">
                      <span className="post-username">{user.username}</span>
                      <span className="post-handle">@{user.username?.toLowerCase()}</span>
                      <span className="post-date">·</span>
                      <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.file && (
                      <img
                        src={`http://localhost:5000${post.file}`}
                        alt="Post content"
                        className="post-image"
                      />
                    )}
                  </div>
                  <div className="post-actions">
                    <div className="action-group">
                      <button className="action-btn comment-btn">
                        <span className="action-icon">💬</span>
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button className="action-btn retweet-btn">
                        <span className="action-icon">🔄</span>
                        <span>0</span>
                      </button>
                      <button
                        className={`action-btn like-btn ${post.likes?.includes(currentUserId) ? 'liked' : ''}`}
                        onClick={() => 
                          post.likes?.includes(currentUserId) 
                            ? handleUnlike(post._id) 
                            : handleLike(post._id)
                        }
                      >
                        <span className="action-icon">❤️</span>
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      <button className="action-btn share-btn">
                        <span className="action-icon">📤</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="media-grid">
            {userPosts.filter(post => post.file).length === 0 ? (
              <div className="no-media">No media posts</div>
            ) : (
              userPosts
                .filter(post => post.file)
                .map((post) => (
                  <div key={post._id} className="media-item">
                    <img
                      src={`http://localhost:5000${post.file}`}
                      alt="Media content"
                      className="media-image"
                    />
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="likes-section">
            <div className="feature-coming-soon">
              Liked posts feature coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;