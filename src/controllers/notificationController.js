const notificationService = require('../services/notificationService.js');

// Lấy tất cả notifications hoặc theo id
const handleGetAllNotification = async (req, res) => {
    try {
        let id = req.query.id_notification || 'ALL';
        let notifications = await notificationService.getAllNotification(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Lấy dữ liệu thành công",
            notifications
        });
    } catch (error) {
        console.error("Lỗi khi lấy notifications:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy notifications"
        });
    }
};

// Tạo notification mới
const postCreateNewNotification = async (req, res) => {
    try {
        const message = await notificationService.createNewNotification(req.body);
        console.log(message);
        return res.status(200).json(message);
    } catch (e) {
        console.error("Lỗi khi tạo notification mới:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo notification mới"
        });
    }
};

// Xóa notification
const handleDeleteNotification = async (req, res) => {
    try {
        const notificationId = req.query.id_notification;

        if (!notificationId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id thông báo!",
            });
        }

        const result = await notificationService.deleteNotification(notificationId);
        console.log(result);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xóa thông báo!",
        });
    }
};

// Lấy thông tin notification theo id
const handleGetNotificationById = async (req, res) => {
    try {
        const notificationId = req.query.id_notification;

        if (!notificationId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id thông báo!",
            });
        }

        const result = await notificationService.getNotificationInfoById(notificationId);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thông tin thông báo!",
        });
    }
};

// Lấy notifications theo user (phụ huynh)
const handleGetNotificationsByUser = async (req, res) => {
    try {
        const userId = req.query.id_user;

        const result = await notificationService.getNotificationsByUser(userId);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy thông báo theo user:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy thông báo"
        });
    }
};

// Lấy notifications cho admin
const handleGetNotificationsForAdmin = async (req, res) => {
    try {
        const result = await notificationService.getNotificationsForAdmin();

        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy thông báo admin:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy thông báo admin"
        });
    }
};

module.exports = {
    handleGetAllNotification,
    postCreateNewNotification,
    handleDeleteNotification,
    handleGetNotificationById,
    handleGetNotificationsByUser,
    handleGetNotificationsForAdmin
};