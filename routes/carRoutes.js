const express = require('express');
const {add} = require('../controllers/cars/add');
const {get} = require('../controllers/cars/get');
const {modify} = require('../controllers/cars/modify');
const {remove} = require('../controllers/cars/remove');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, add);

router.get('/:vehicleId', verifyToken, get);

router.put('/:vehicleId', verifyToken, modify);

router.delete('/:vehicleId', verifyToken, remove);

module.exports = router;