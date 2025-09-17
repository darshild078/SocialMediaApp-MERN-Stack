import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiSend, FiX, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import './CreatePost.css';

function CreatePost() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const MAX_CHARS = 280;
  const remainingChars = MAX_CHARS - content.length;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('file', file);

      await API.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to create post:', error);
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
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="page-container pt-20">
        <div className="container">
          <motion.div
            className="success-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <div className="card-base success-card text-center">
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 300 }}
              >
                ✅
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Created!</h2>
              <p className="text-gray-600 mb-6">Your post has been shared with your followers.</p>
              <motion.div
                className="loading-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </motion.div>
              <p className="text-sm text-gray-500 mt-3">Redirecting to feed...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pt-20">
      <div className="container">
        <motion.div
          className="create-post-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="create-post-header mb-8 text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">Create Post</h1>
            <p className="text-gray-600">Share your thoughts with the world</p>
          </div>

          <div className="card-base create-post-card">
            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  What's on your mind?
                </label>
                <textarea
                  id="content"
                  className="input-base textarea-base post-textarea"
                  placeholder="Share your thoughts... ✨"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={MAX_CHARS}
                  required
                />
                <div className="char-counter">
                  <span className={`char-count ${remainingChars < 20 ? 'warning' : ''} ${remainingChars < 0 ? 'error' : ''}`}>
                    {remainingChars} characters remaining
                  </span>
                </div>
              </div>

              <div className="media-upload-section">
                {!preview ? (
                  <motion.label
                    className="upload-area"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="upload-content">
                      <motion.div
                        className="upload-icon"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiUpload size={32} />
                      </motion.div>
                      <p className="upload-text">Click to upload an image</p>
                      <p className="upload-hint">PNG, JPG up to 10MB</p>
                    </div>
                  </motion.label>
                ) : (
                  <motion.div
                    className="preview-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img src={preview} alt="Preview" className="preview-image" />
                    <motion.button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeFile}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="form-actions">
                <motion.button
                  type="button"
                  className="btn-base btn-secondary"
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  className={`btn-base btn-primary ${isLoading || !content.trim() || remainingChars < 0 ? 'btn-disabled' : ''}`}
                  disabled={isLoading || !content.trim() || remainingChars < 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend size={18} />
                      <span>Share Post</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreatePost;