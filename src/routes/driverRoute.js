
const express = require('express');
const driverController = require('../controllers/driverController.js');

const router = express.Router();

// router.get('/create-driver', driverController.handleCreateDriver); // chưa xài

router.get('/read-driver', driverController.handleGetAllDrivers);

router.get('/driver-byid', driverController.handleGetDriverInfoById);

router.post('/create-new-driver', driverController.handleCreateDriver);

router.delete('/delete-driver', driverController.handleDeleteDriver);

router.put("/update-status-driver", driverController.handleUpdateDriverStatus);

router.put("/update-user", driverController.handleUpdateDriver);

router.put("/update-location", driverController.handleUpdateDriverLocation);

router.get("/all-locations", driverController.handleGetAllDriverLocations);

router.get("/all-locations", driverController.handleGetDriverLocations);

module.exports = router;
