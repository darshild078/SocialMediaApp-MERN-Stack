const express = require('express');
const { 
  createPost, 
  getAllPosts, 
  likePost, 
  unlikePost, 
  deletePost, 
  addComment,
  getUserPosts 
} = require('../controllers/postController');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.delete('/:id', auth, deletePost);
router.post('/create', auth, upload.single('file'), createPost);
router.post('/:id/comment', auth, addComment);
router.put('/:id/like', auth, likePost);
router.put('/:id/unlike', auth, unlikePost);
router.get('/', getAllPosts);
router.get('/user/:userId', auth, getUserPosts); // NEW ROUTE for user-specific posts

module.exports = router;