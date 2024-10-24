const express = require('express');
const { register } = require('../controllers/register');
const { login } = require('../controllers/login');
const { logout } = require('../controllers/logout');
const { erase } = require('../controllers/delete');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

module.exports = router;

