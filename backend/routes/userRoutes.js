const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateUserProfile, getUserProfile, searchUser } = require('../controllers/userController');
const { followUser, unfollowUser } = require('../controllers/userController');
const authenticateUser = require('../middleware/authenticateUser');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', updateUserProfile);
router.get('user/:id', auth, getUserProfile); // Get a user's profile
// Follow a user
router.put('/:id/follow', auth, followUser);

// Unfollow a user
router.put('/:id/unfollow', auth, unfollowUser);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
});

router.get('/profile', authenticateUser, (req, res) => {
  console.log('User object in request:', req.user); // Debugging message
  res.send(req.user);
});


  
const upload = multer({ storage });
  
// Update user profile with image upload
router.put('/profile', auth, upload.single('profilePicture'), updateUserProfile);
  

module.exports = router;
