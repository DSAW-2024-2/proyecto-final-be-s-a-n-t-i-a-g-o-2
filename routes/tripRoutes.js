const express = require('express');
const { newtrip } = require('../controllers/trips/newtrip');
const { gettrips } = require('../controllers/trips/gettrips');
const { selecttrip } = require('../controllers/trips/selecttrip');
const { filtertrips } = require('../controllers/trips/filtertrips');
const { deletetrips } = require('../controllers/trips/deletetrips');
const { getTripByDriverUID } = require('../controllers/trips/getTripByDriverUID');
const { verifyToken } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/newtrip', verifyToken, newtrip);

router.get('/alltrips', gettrips);

router.post('/select', verifyToken, selecttrip);

router.get('/filter', filtertrips);

router.get('/driver/:driverUID', verifyToken, getTripByDriverUID);

router.delete('/:tripID', verifyToken, deletetrips);

module.exports = router;
