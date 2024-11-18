const express = require('express');
const { newtrip } = require('../controllers/trips/newtrip');
const { gettrips } = require('../controllers/trips/gettrips');
const { selecttrip } = require('../controllers/trips/selecttrip');
//const { filterTrips } = require('../controllers/trips/filterTrips');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/newtrip', verifyToken, newtrip);

router.get('/', gettrips);

router.post('/select', verifyToken, selecttrip);

//router.get('/filter', filterTrips);

module.exports = router;
