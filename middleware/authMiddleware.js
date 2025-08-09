const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user id and role to the request object from the token's payload
            req.user = { id: decoded.id, role: decoded.role };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Grant access to specific roles (case-insensitive)
exports.authorize = (...roles) => {
    const allowed = roles.map(r => String(r).toLowerCase());
    return (req, res, next) => {
        const role = req?.user?.role;
        if (!role) {
            return res.status(401).json({ message: 'Not authorized, user role missing' });
        }
        if (!allowed.includes(String(role).toLowerCase())) {
            return res.status(403).json({ message: `User role ${role} is not authorized to access this route` });
        }
        next();
    };
};
