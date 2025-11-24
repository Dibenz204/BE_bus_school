const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Lấy tất cả buses hoặc bus theo query parameter
router.get('/get-buses', busController.getAllBuses);

// Lấy bus theo ID (query parameter)
router.get('/get-bus', busController.getBusById);

// Tạo bus mới
router.post('/create-bus', busController.createNewBus);

// Cập nhật bus
router.put('/update-bus', busController.updateBus);

// Xóa bus (query parameter)
router.delete('/delete-bus', busController.deleteBus);

// Lấy danh sách routes cho combobox
router.get('/get-routes', busController.getRoutes);

// Lấy danh sách drivers cho combobox
router.get('/get-drivers', busController.getDrivers);

module.exports = router;