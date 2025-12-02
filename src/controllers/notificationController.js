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

// Tạo notification mới (cơ bản)
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

// =========== NEW CONTROLLERS ===========

// Admin: Gửi thông báo theo role hoặc user cụ thể
// const handleSendNotificationByAdmin = async (req, res) => {
//     try {
//         const { message, recipient_type, notification_type, role, id_user, id_schedule } = req.body;

//         // Kiểm tra quyền admin (cần middleware xác thực)
//         // const user = req.user; // Giả sử có middleware auth
//         // if (!user || user.role !== 'Quản trị viên') {
//         //     return res.status(403).json({
//         //         errCode: 1,
//         //         message: 'Chỉ admin mới có quyền gửi thông báo!'
//         //     });
//         // }

//         const result = await notificationService.sendNotificationByAdmin({
//             message,
//             recipient_type,
//             notification_type,
//             role,
//             id_user,
//             id_schedule
//         });

//         return res.status(200).json(result);

//     } catch (error) {
//         console.error("Lỗi khi admin gửi thông báo:", error);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi hệ thống khi gửi thông báo"
//         });
//     }
// };
// Admin: Gửi thông báo theo role hoặc user cụ thể
const handleSendNotificationByAdmin = async (req, res) => {
    try {
        const { message, recipient_type, notification_type, role, id_user, id_schedule } = req.body;

        console.log('📨 Request body:', req.body); // DEBUG

        // Validate cơ bản
        if (!message || !notification_type || !recipient_type) {
            return res.status(400).json({
                errCode: 1,
                message: 'Thiếu thông tin bắt buộc!'
            });
        }

        // Nếu gửi theo role mà không có role
        if (recipient_type === 'role' && !role) {
            return res.status(400).json({
                errCode: 1,
                message: 'Vui lòng chọn vai trò!'
            });
        }

        // Nếu gửi cho người cụ thể mà không có id_user
        if (recipient_type === 'specific' && !id_user) {
            return res.status(400).json({
                errCode: 1,
                message: 'Vui lòng chọn người nhận!'
            });
        }

        const result = await notificationService.sendNotificationByAdmin({
            message,
            recipient_type,
            notification_type,
            role,
            id_user,
            id_schedule
        });

        return res.status(200).json(result);

    } catch (error) {
        console.error("❌ Lỗi khi admin gửi thông báo:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi gửi thông báo"
        });
    }
};

// Driver: Gửi thông báo sự cố
const handleSendIncidentNotification = async (req, res) => {
    try {
        const { id_driver, id_schedule, message } = req.body;

        // Kiểm tra quyền driver (cần middleware xác thực)
        // const user = req.user;
        // if (!user || user.role !== 'Tài xế') {
        //     return res.status(403).json({
        //         errCode: 1,
        //         message: 'Chỉ tài xế mới có quyền gửi thông báo sự cố!'
        //     });
        // }

        const result = await notificationService.sendIncidentNotification({
            id_driver,
            id_schedule,
            message
        });

        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi driver gửi thông báo sự cố:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi gửi thông báo sự cố"
        });
    }
};

// Lấy users theo role (cho admin select)
const handleGetUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số role!"
            });
        }

        const result = await notificationService.getUsersByRole(role);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy users theo role:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy users"
        });
    }
};

// Lấy tất cả users (cho admin select)
const handleGetAllUsers = async (req, res) => {
    try {
        const result = await notificationService.getAllUsers();
        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy tất cả users:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy users"
        });
    }
};

// Đánh dấu thông báo đã đọc
const handleMarkAsRead = async (req, res) => {
    try {
        const { notificationId, userId } = req.body;

        if (!notificationId || !userId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc!"
            });
        }

        const result = await notificationService.markAsRead(notificationId, userId);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi đánh dấu đã đọc"
        });
    }
};

// Lấy thống kê thông báo
const handleGetNotificationStats = async (req, res) => {
    try {
        const result = await notificationService.getNotificationStats();
        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy thống kê"
        });
    }
};

module.exports = {
    // CRUD functions
    handleGetAllNotification,
    postCreateNewNotification,
    handleDeleteNotification,
    handleGetNotificationById,
    handleGetNotificationsByUser,
    handleGetNotificationsForAdmin,

    // New functions
    handleSendNotificationByAdmin,
    handleSendIncidentNotification,
    handleGetUsersByRole,
    handleGetAllUsers,
    handleMarkAsRead,
    handleGetNotificationStats
};

// const notificationService = require('../services/notificationService.js');

// // Lấy tất cả notifications hoặc theo id
// const handleGetAllNotification = async (req, res) => {
//     try {
//         let id = req.query.id_notification || 'ALL';
//         let notifications = await notificationService.getAllNotification(id);

//         return res.status(200).json({
//             errCode: 0,
//             errMessage: "Lấy dữ liệu thành công",
//             notifications
//         });
//     } catch (error) {
//         console.error("Lỗi khi lấy notifications:", error);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi hệ thống khi lấy notifications"
//         });
//     }
// };

// // Tạo notification mới
// const postCreateNewNotification = async (req, res) => {
//     try {
//         const message = await notificationService.createNewNotification(req.body);
//         console.log(message);
//         return res.status(200).json(message);
//     } catch (e) {
//         console.error("Lỗi khi tạo notification mới:", e);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi hệ thống khi tạo notification mới"
//         });
//     }
// };

// // Xóa notification
// const handleDeleteNotification = async (req, res) => {
//     try {
//         const notificationId = req.query.id_notification;

//         if (!notificationId) {
//             return res.status(400).json({
//                 errCode: 1,
//                 message: "Không tìm thấy id thông báo!",
//             });
//         }

//         const result = await notificationService.deleteNotification(notificationId);
//         console.log(result);
//         return res.status(200).json(result);

//     } catch (e) {
//         console.error(e);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi server khi xóa thông báo!",
//         });
//     }
// };

// // Lấy thông tin notification theo id
// const handleGetNotificationById = async (req, res) => {
//     try {
//         const notificationId = req.query.id_notification;

//         if (!notificationId) {
//             return res.status(400).json({
//                 errCode: 1,
//                 message: "Không tìm thấy id thông báo!",
//             });
//         }

//         const result = await notificationService.getNotificationInfoById(notificationId);
//         return res.status(200).json(result);

//     } catch (e) {
//         console.error(e);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi server khi lấy thông tin thông báo!",
//         });
//     }
// };

// // Lấy notifications theo user (phụ huynh)
// const handleGetNotificationsByUser = async (req, res) => {
//     try {
//         const userId = req.query.id_user;

//         const result = await notificationService.getNotificationsByUser(userId);

//         return res.status(200).json(result);

//     } catch (error) {
//         console.error("Lỗi khi lấy thông báo theo user:", error);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi hệ thống khi lấy thông báo"
//         });
//     }
// };

// // Lấy notifications cho admin
// const handleGetNotificationsForAdmin = async (req, res) => {
//     try {
//         const result = await notificationService.getNotificationsForAdmin();

//         return res.status(200).json(result);

//     } catch (error) {
//         console.error("Lỗi khi lấy thông báo admin:", error);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi hệ thống khi lấy thông báo admin"
//         });
//     }
// };

// module.exports = {
//     handleGetAllNotification,
//     postCreateNewNotification,
//     handleDeleteNotification,
//     handleGetNotificationById,
//     handleGetNotificationsByUser,
//     handleGetNotificationsForAdmin
// };