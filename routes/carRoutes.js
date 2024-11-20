const express = require('express');
const {add} = require('../controllers/cars/add');
const {get} = require('../controllers/cars/get');
const {modify} = require('../controllers/cars/modify');
const {remove} = require('../controllers/cars/remove');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, add);

router.get('/:carid', verifyToken, get);

router.put('/:carid', verifyToken, modify);

router.delete('/:vehicleuid', verifyToken, remove);

module.exports = router;