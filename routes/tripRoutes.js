const express = require('express');
const { newtrip } = require('../controllers/trips/newtrip');
/*const { listTrips } = require('../controllers/trips/listTrips');
const { selectTrip } = require('../controllers/trips/selectTrip');
const { filterTrips } = require('../controllers/trips/filterTrips');*/
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/newtrip', verifyToken, newtrip);

/*router.get('/', listTrips);

router.post('/select', verifyToken, selectTrip);

router.get('/filter', filterTrips);*/

module.exports = router;
