import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiGlobe, FiCamera, FiEdit3, FiSave, FiSettings } from 'react-icons/fi';
import API from '../../api';
import './Profile.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFormData(res.data);
        if (res.data.profilePic) {
          setPreviewProfile(`http://localhost:5000/${res.data.profilePic}`);
        }
        if (res.data.coverPic) {
          setPreviewCover(`http://localhost:5000/${res.data.coverPic}`);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profilePic') {
        setProfilePic(file);
        setPreviewProfile(URL.createObjectURL(file));
      } else {
        setCoverPic(file);
        setPreviewCover(URL.createObjectURL(file));
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

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
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-container pt-20">
      <div className="container">
        <motion.div
          className="profile-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="profile-header mb-8 text-center" variants={cardVariants}>
            <h1 className="text-4xl font-bold text-gradient mb-2">Edit Profile</h1>
            <p className="text-gray-600">Customize your Switter profile</p>
          </motion.div>

          {/* Cover Photo Section */}
          <motion.div className="card-base card-hover cover-section mb-8" variants={cardVariants}>
            <div className="cover-photo-container">
              {previewCover ? (
                <img src={previewCover} alt="Cover" className="cover-photo" />
              ) : (
                <div className="cover-placeholder">
                  <FiCamera size={32} className="text-gray-400" />
                  <span className="text-gray-600 mt-2">Add Cover Photo</span>
                </div>
              )}
              <motion.label 
                className="photo-upload-btn cover-upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit3 size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverPic')}
                  className="hidden"
                />
              </motion.label>
            </div>

            {/* Profile Photo */}
            <div className="profile-photo-container">
              {previewProfile ? (
                <img src={previewProfile} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-placeholder avatar-base avatar-2xl avatar-gradient">
                  <FiUser size={32} />
                </div>
              )}
              <motion.label 
                className="photo-upload-btn profile-upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profilePic')}
                  className="hidden"
                />
              </motion.label>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div className="card-base profile-form-card" variants={cardVariants}>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    <FiUser className="inline mr-2" />
                    Username
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Your username"
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    <FiMapPin className="inline mr-2" />
                    Location
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="website" className="form-label">
                    <FiGlobe className="inline mr-2" />
                    Website
                  </label>
                  <div className="input-group">
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="input-base textarea-base"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="themePreference" className="form-label">
                    <FiSettings className="inline mr-2" />
                    Theme
                  </label>
                  <select
                    id="themePreference"
                    name="themePreference"
                    value={formData.themePreference}
                    onChange={handleChange}
                    className="input-base"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="accountPrivacy" className="form-label">Privacy</label>
                  <select
                    id="accountPrivacy"
                    name="accountPrivacy"
                    value={formData.accountPrivacy}
                    onChange={handleChange}
                    className="input-base"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {message && (
                <motion.div
                  className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className={`btn-base btn-primary w-full ${isLoading ? 'btn-disabled' : ''}`}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;