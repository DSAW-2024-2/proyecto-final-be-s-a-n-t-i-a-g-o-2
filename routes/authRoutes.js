const express = require('express');
const { register } = require('../controllers/register');
const { login } = require('../controllers/login');
const { logout } = require('../controllers/logout');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', verifyToken, logout);

module.exports = router;

