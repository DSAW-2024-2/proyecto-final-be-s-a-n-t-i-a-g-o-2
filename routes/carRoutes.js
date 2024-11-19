const express = require('express');
const {add} = require('../controllers/cars/add');
const {get} = require('../controllers/cars/get');
const {modify} = require('../controllers/cars/modify');
const {remove} = require('../controllers/cars/remove');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, add);

router.get('/:vehicleuid', verifyToken, get);

router.put('/:uid', verifyToken, modify);

router.delete('/:uid', verifyToken, remove);

module.exports = router;