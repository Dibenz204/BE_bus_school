const express = require('express');
const notificationController = require('../controllers/notificationController.js');

const router = express.Router();

// Lấy tất cả notifications hoặc notification theo id
router.get('/read_notification', notificationController.handleGetAllNotification);

// Lấy thông tin notification theo id (chi tiết)
router.get('/get-notification-by-id', notificationController.handleGetNotificationById);

// Tạo notification mới
router.post('/create-new-notification', notificationController.postCreateNewNotification);

// Xóa notification
router.delete('/delete-notification', notificationController.handleDeleteNotification);

// Lấy notifications theo user (phụ huynh)
router.get('/get-by-user', notificationController.handleGetNotificationsByUser);

// Lấy notifications cho admin
router.get('/get-for-admin', notificationController.handleGetNotificationsForAdmin);

module.exports = router;