const express = require('express');
const { register } = require('../controllers/users/register');
const { login } = require('../controllers/users/login');
const { logout } = require('../controllers/users/logout');
const { get } = require('../controllers/users/get');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', verifyToken, logout);

router.post('/get', verifyToken, get);

module.exports = router;

