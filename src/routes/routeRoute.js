const express = require('express');
const routeController = require('../controllers/routeController.js');
const routeBusStopController = require('../controllers/routeBusstopController.js');

const router = express.Router();

router.get('/read_route', routeController.handleGetAllRoute);

router.post('/create-new-route', routeController.postCreateNewRoute);

router.delete('/delete-route', routeController.handleDeleteRoute);

router.put("/update-route", routeController.handleUpdateRoute);


router.get('/get-busstops-by-route', routeBusStopController.getBusStopsByRoute);

router.post('/save-route-busstops', routeBusStopController.saveRouteBusStops);

module.exports = router;