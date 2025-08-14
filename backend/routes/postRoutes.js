const express = require('express');
const { createPost, getAllPosts, likePost, unlikePost } = require('../controllers/postController');
const { deletePost } = require('../controllers/postController');
const { addComment } = require('../controllers/postController');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.delete('/:id', auth, deletePost);
router.post('/create',auth, upload.single('file'), createPost);
router.post('/:id/comment',auth, addComment);
router.put('/:id/like',auth,likePost);
router.put('/:id/unlike',auth,unlikePost);
router.get('/', getAllPosts);

module.exports = router;