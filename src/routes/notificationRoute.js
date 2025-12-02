const express = require('express');
const notificationController = require('../controllers/notificationController.js');

const router = express.Router();

// =========== CRUD ROUTES ===========
// Lấy tất cả notifications hoặc notification theo id
router.get('/read_notification', notificationController.handleGetAllNotification);

// Lấy thông tin notification theo id (chi tiết)
router.get('/get-notification-by-id', notificationController.handleGetNotificationById);

// Tạo notification mới (cơ bản)
router.post('/create-new-notification', notificationController.postCreateNewNotification);

// Xóa notification
router.delete('/delete-notification', notificationController.handleDeleteNotification);

// Lấy notifications theo user (phụ huynh)
router.get('/get-by-user', notificationController.handleGetNotificationsByUser);

// Lấy notifications cho admin
router.get('/get-for-admin', notificationController.handleGetNotificationsForAdmin);

// =========== NEW ROUTES ===========
// Admin: Gửi thông báo theo role/user
router.post('/send-by-admin', notificationController.handleSendNotificationByAdmin);

// Driver: Gửi thông báo sự cố
router.post('/send-incident', notificationController.handleSendIncidentNotification);

// Lấy users theo role (cho admin select)
router.get('/get-users-by-role', notificationController.handleGetUsersByRole);

// Lấy tất cả users (cho admin select)
router.get('/get-all-users', notificationController.handleGetAllUsers);

// Đánh dấu thông báo đã đọc
router.put('/mark-as-read', notificationController.handleMarkAsRead);

// Lấy thống kê thông báo
router.get('/stats', notificationController.handleGetNotificationStats);

module.exports = router;


// const express = require('express');
// const notificationController = require('../controllers/notificationController.js');

// const router = express.Router();

// // Lấy tất cả notifications hoặc notification theo id
// router.get('/read_notification', notificationController.handleGetAllNotification);

// // Lấy thông tin notification theo id (chi tiết)
// router.get('/get-notification-by-id', notificationController.handleGetNotificationById);

// // Tạo notification mới
// router.post('/create-new-notification', notificationController.postCreateNewNotification);

// // Xóa notification
// router.delete('/delete-notification', notificationController.handleDeleteNotification);

// // Lấy notifications theo user (phụ huynh)
// router.get('/get-by-user', notificationController.handleGetNotificationsByUser);

// // Lấy notifications cho admin
// router.get('/get-for-admin', notificationController.handleGetNotificationsForAdmin);

// module.exports = router;