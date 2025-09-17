const jwt = require('jsonwebtoken');

// Google Auth Success Handler
exports.googleAuthSuccess = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            message: 'Google authentication successful',
            token,
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profilePic: req.user.profilePic,
                isGoogleUser: req.user.isGoogleUser
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during Google authentication' });
    }
};
