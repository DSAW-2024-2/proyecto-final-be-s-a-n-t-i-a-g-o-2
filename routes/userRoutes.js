const express = require('express');
const {register} = require('../controllers/users/register');
const {login} = require('../controllers/users/login');
const {logout} = require('../controllers/users/logout');
const {get} = require('../controllers/users/get');
const {modify} = require('../controllers/users/modify');

const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', verifyToken, logout);

router.get('/:uid', verifyToken, get);

router.put('/:uid', verifyToken, modify);

module.exports = router;