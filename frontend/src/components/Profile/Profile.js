import React, { useState, useEffect } from 'react';
import API from '../../api';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    themePreference: 'light',
    accountPrivacy: 'public'
  });
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [previewProfile, setPreviewProfile] = useState('');
  const [previewCover, setPreviewCover] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFormData(res.data);
        setPreviewProfile(res.data.profilePic);
        setPreviewCover(res.data.coverPic);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'profilePic') {
      setProfilePic(file);
      setPreviewProfile(URL.createObjectURL(file));
    } else {
      setCoverPic(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach(key => fd.append(key, formData[key]));
    if (profilePic) fd.append('profilePic', profilePic);
    if (coverPic) fd.append('coverPic', coverPic);

    try {
      await API.put('/users/profile', fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
        <select name="themePreference" value={formData.themePreference} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <select name="accountPrivacy" value={formData.accountPrivacy} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <div>
          <label>Profile Picture:</label>
          <input type="file" onChange={e => handleFileChange(e, 'profilePic')} />
          {previewProfile && <img src={previewProfile} alt="Profile Preview" width="100" />}
        </div>
        <div>
          <label>Cover Picture:</label>
          <input type="file" onChange={e => handleFileChange(e, 'coverPic')} />
          {previewCover && <img src={previewCover} alt="Cover Preview" width="200" />}
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;