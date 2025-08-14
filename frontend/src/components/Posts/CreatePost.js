import React, { useState } from 'react';
import API from '../../api';

function CreatePost() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('file', file); // Append file

    try {
      await API.post('/posts/create', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data', // Form data for file upload
        },
      });

      alert('Post created successfully!');
      setContent('');
      setFile(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    }
  };

  return (
    <div>
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])} // File input
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
