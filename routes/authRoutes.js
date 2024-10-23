const express = require('express');
const { register, login, logout} = require('../controllers/authController');
const router = express.Router();

router.use('/register', register);

router.use('/login', login);

router.use('/logout', logout);

module.exports = router;
