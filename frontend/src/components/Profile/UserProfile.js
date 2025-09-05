import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get(`/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedUser = response.data;
        setUser(fetchedUser);
        const currentUserId = localStorage.getItem('userId');
        setIsFollowing(fetchedUser.followers?.some(followerId => followerId === currentUserId));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      }
    };
    fetchUserProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      await API.put(`/users/${id}/follow`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsFollowing(true);
      setUser((prevUser) => ({
        ...prevUser,
        followers: [...(prevUser.followers || []), localStorage.getItem('userId')],
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
        followers: prevUser.followers.filter(followerId => followerId !== localStorage.getItem('userId')),
      }));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '20px auto',
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 8,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        {user.profilePic ? (
          <img
            src={`http://localhost:5000${user.profilePic}`}
            alt={`${user.username}'s profile`}
            style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', marginRight: 20 }}
          />
        ) : (
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              color: '#666',
              marginRight: 20,
            }}
          >
            ?
          </div>
        )}

        <div>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>{user.username || 'User'}</h2>
          <p style={{ fontStyle: 'italic', color: '#888' }}>{user.bio || 'This user has no bio.'}</p>
          <p>
            <strong>Followers:</strong> {user.followers?.length || 0} <br />
            <strong>Following:</strong> {user.following?.length || 0}
          </p>
          {localStorage.getItem('userId') !== id && (
            isFollowing ? (
              <button onClick={handleUnfollow} style={{ padding: '8px 16px', cursor: 'pointer' }}>Unfollow</button>
            ) : (
              <button onClick={handleFollow} style={{ padding: '8px 16px', cursor: 'pointer' }}>Follow</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;