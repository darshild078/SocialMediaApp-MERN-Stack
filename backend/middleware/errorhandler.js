const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Validation Error', 
            details: err.message 
        });
    }
    
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: 'Invalid ID format' 
        });
    }
    
    // Google Auth specific errors
    if (err.name === 'GoogleAuthError') {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
    
    // Default server error
    res.status(500).json({ 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
};

module.exports = errorHandler;
