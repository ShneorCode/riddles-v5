import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!tokenFromHeader && !(req.body.username && req.body.password)) {
        req.user = { role: 'guest' };
        return next();
    }

    if (tokenFromHeader) {
        jwt.verify(tokenFromHeader, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: 'Login required or invalid token.' });
    }
}

export function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
        next();
    };
}