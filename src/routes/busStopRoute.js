const express = require('express');
const busStopController = require('../controllers/busStopController.js');
const routeBusStopController = require('../controllers/routeBusstopController.js');

const router = express.Router();

router.post('/create-bus-stop', busStopController.postCreateBusStop);

router.get('/get-all-bus-stops', busStopController.getAllBusStops);

router.delete('/delete-bus-stop', busStopController.deleteBusStop);

router.get('/get-busstops-by-route', routeBusStopController.getBusStopsByRoute);

router.post('/save-route-busstops', routeBusStopController.saveRouteBusStops);

module.exports = router;