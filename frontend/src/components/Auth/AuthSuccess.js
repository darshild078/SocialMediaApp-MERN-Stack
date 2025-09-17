import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            navigate('/'); // Redirect to your main page
        } else {
            navigate('/login');
        }
    }, [navigate, searchParams, setIsAuthenticated]);

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
                <div className="floating-orb orb-3" />
            </div>
            <div className="card-base auth-card">
                <div className="auth-header">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Authentication...</h2>
                    <p className="text-gray-600">Please wait while we sign you in</p>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;
