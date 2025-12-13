const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: 'Access denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Check if token is expired or just invalid
                const isExpired = err.name === 'TokenExpiredError';
                
                return res.status(isExpired ? 401 : 403).json({ 
                    success: false,
                    error: isExpired ? 'Token has expired' : 'Invalid or malformed token',
                    code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
                    details: isExpired ? { message: 'Please refresh your token' } : undefined
                });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Internal server error.',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};

// middleware to authorize based on user roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false,
                    error: 'You do not have permission to perform this action',
                    code: 'INSUFFICIENT_PERMISSIONS',
                    details: {
                        required: allowedRoles.length === 1 ? allowedRoles[0] : allowedRoles,
                        current: req.user?.role
                    }
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ 
                success: false,
                error: 'Internal server error.',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    };
};
module.exports = { authenticateToken, authorizeRoles };