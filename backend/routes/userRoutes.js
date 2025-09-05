const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const authenticateUser = require('../middleware/authenticateUser');
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  followUser,
  unfollowUser,
} = require('../controllers/userController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile routes
router.get('/profile/:id', auth, getUserProfile); // Auth-protected route
router.get('/profile', authenticateUser, (req, res) => res.send(req.user));
router.put(
  '/profile',
  auth,
  upload.fields([{ name: 'profilePic' }, { name: 'coverPic' }]),
  updateUserProfile
);

// Follow/unfollow
router.put('/:id/follow', auth, followUser);
router.put('/:id/unfollow', auth, unfollowUser);

module.exports = router;