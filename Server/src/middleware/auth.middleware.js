const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Bearer token
        if (token.startsWith('Bearer')) {
            token = token.split(' ')[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};