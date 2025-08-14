import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
        setIsFollowing(response.data.followers.includes(localStorage.getItem('userId')));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
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
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <img src={user.profilePicture} alt={`${user.username}'s profile`} width="150" />
      <p>{user.bio}</p>
      <p>Followers: {user.followers?.length}</p>
      <p>Following: {user.following?.length}</p>
      {isFollowing ? (
        <button onClick={handleUnfollow}>Unfollow</button>
      ) : (
        <button onClick={handleFollow}>Follow</button>
      )}
    </div>
  );
}

export default UserProfile;
