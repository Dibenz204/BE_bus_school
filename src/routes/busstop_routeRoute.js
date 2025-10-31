const express = require('express');
const routeBusStopController = require('../controllers/routeBusstopController.js');

const router = express.Router();


router.get('/get-busstops-by-route', routeBusStopController.getBusStopsByRoute);

router.post('/save-route-busstops', routeBusStopController.saveRouteBusStops);

module.exports = router;