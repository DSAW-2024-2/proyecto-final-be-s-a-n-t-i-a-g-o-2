const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Verificar si existe el token
    if (!token) {
        return res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token JWT:', error);
        res.status(401).json({ error: 'Token de autorización inválido o expirado' });
    }
}

module.exports = { verifyToken };