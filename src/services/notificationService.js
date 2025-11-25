const db = require('../models/index.js');
const turf = require('@turf/turf');
const { sendRealTimeNotification } = require('../socketNotifier.js');

// ==================== BUS STOP NOTIFICATION LOGIC ====================

// Hàm chính: kiểm tra và gửi thông báo khi xe đến gần trạm
const checkAndSendBusStopNotifications = async (id_driver, latitude, longitude) => {
    try {
        console.log(`📍 Checking bus stops for driver: ${id_driver}`);

        // 1. Lấy thông tin driver và schedule hiện tại
        const driver = await db.Driver.findByPk(id_driver, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['name']
            }]
        });

        if (!driver) {
            console.log('❌ Driver not found');
            return;
        }

        // 2. Tìm schedule đang hoạt động của driver hôm nay
        const today = new Date().toISOString().split('T')[0];
        const currentSchedule = await db.Schedule.findOne({
            where: {
                id_driver: id_driver,
                Sdate: today,
                status: 'Vận hành'
            },
            include: [{
                model: db.Route,
                as: 'routes',
                include: [{
                    model: db.busStop,
                    as: 'busstops',
                    through: { attributes: ['stt_busstop'] }
                }]
            }]
        });

        if (!currentSchedule || !currentSchedule.routes) {
            console.log('❌ No active schedule found for today');
            return;
        }

        const busStops = currentSchedule.routes.busstops;
        console.log(`🟡 Checking ${busStops.length} bus stops`);

        // 3. Kiểm tra khoảng cách với từng bus stop
        for (const busStop of busStops) {
            const proximity = calculateProximity(
                { toado_x: longitude, toado_y: latitude },
                busStop,
                200 // 200 meters threshold
            );

            if (proximity.isNear) {
                console.log(`🚨 Near bus stop: ${busStop.name_station} (${proximity.distance}m)`);

                // 4. Kiểm tra xem đã gửi thông báo cho trạm này chưa
                const alreadyNotified = await db.Notification.findOne({
                    where: {
                        id_schedule: currentSchedule.id_schedule,
                        id_busstop: busStop.id_busstop,
                        recipient_type: 'parent'
                    }
                });

                if (!alreadyNotified) {
                    // 5. Gửi thông báo cho tất cả phụ huynh có học sinh ở trạm này
                    await sendNotificationsToParents(
                        currentSchedule.id_schedule,
                        busStop,
                        driver,
                        proximity.distance
                    );
                }
            }
        }

    } catch (error) {
        console.error('❌ Error in bus stop notification service:', error);
    }
};

// Tính khoảng cách giữa driver và bus stop
const calculateProximity = (driver, busStop, thresholdMeters = 200) => {
    const driverPoint = turf.point([driver.toado_x, driver.toado_y]);
    const busStopPoint = turf.point([busStop.toado_x, busStop.toado_y]);

    const distance = turf.distance(driverPoint, busStopPoint, { units: 'meters' });

    return {
        isNear: distance <= thresholdMeters,
        distance: Math.round(distance),
        busStop: busStop
    };
};

// Gửi thông báo cho tất cả phụ huynh có học sinh ở trạm này
const sendNotificationsToParents = async (id_schedule, busStop, driver, distance) => {
    try {
        console.log(`📢 Sending notifications for bus stop: ${busStop.name_station}`);

        // 1. Tìm tất cả học sinh có busStop này
        const students = await db.Student.findAll({
            where: { id_busstop: busStop.id_busstop },
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id_user', 'name', 'phone']
            }]
        });

        console.log(`👨‍👩‍👧‍👦 Found ${students.length} students at this bus stop`);

        // 2. Tạo thông báo cho từng phụ huynh
        const notifications = [];

        for (const student of students) {
            const notification = await db.Notification.create({
                id_schedule: id_schedule,
                id_busstop: busStop.id_busstop,
                id_driver: driver.id_driver,
                id_user: student.id_user,
                message: `🚌 Xe bus của ${driver.user.name} đang đến gần điểm đón "${busStop.name_station}" (còn khoảng ${distance}m). Hãy chuẩn bị đón ${student.name}!`,
                recipient_type: 'parent',
                notification_type: 'bus_approaching'
            });

            notifications.push(notification);

            // 3. Gửi thông báo real-time qua socket
            sendRealTimeNotification(notification, student.id_user);
        }

        // 4. Tạo thông báo cho admin
        const adminNotification = await db.Notification.create({
            id_schedule: id_schedule,
            id_busstop: busStop.id_busstop,
            id_driver: driver.id_driver,
            message: `📊 Xe ${driver.id_driver} (${driver.user.name}) đang đến gần điểm "${busStop.name_station}"`,
            recipient_type: 'admin',
            notification_type: 'bus_approaching'
        });

        // Gửi thông báo real-time cho admin
        sendRealTimeNotification(adminNotification, 'admin');

        console.log(`✅ Sent ${notifications.length} parent notifications and 1 admin notification`);

        return notifications;

    } catch (error) {
        console.error('❌ Error sending notifications to parents:', error);
    }
};


// ==================== BASIC CRUD OPERATIONS ====================

// Lấy tất cả notifications hoặc theo id
const getAllNotification = (notificationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = [];
            if (notificationId === 'ALL') {
                notifications = await db.Notification.findAll({
                    include: [
                        {
                            model: db.Schedule,
                            as: 'schedule',
                            attributes: ['id_schedule', 'Sdate', 'Stime']
                        },
                        {
                            model: db.busStop,
                            as: 'busstop',
                            attributes: ['id_busstop', 'name_station']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver'],
                            include: [{
                                model: db.User,
                                as: 'user',
                                attributes: ['name']
                            }]
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    raw: false,
                    nest: true
                });
            } else if (notificationId && notificationId !== 'ALL') {
                const notification = await db.Notification.findOne({
                    where: { id_notification: notificationId },
                    include: [
                        {
                            model: db.Schedule,
                            as: 'schedule',
                            attributes: ['id_schedule', 'Sdate', 'Stime']
                        },
                        {
                            model: db.busStop,
                            as: 'busstop',
                            attributes: ['id_busstop', 'name_station']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver'],
                            include: [{
                                model: db.User,
                                as: 'user',
                                attributes: ['name']
                            }]
                        }
                    ],
                    raw: false,
                    nest: true
                });
                notifications = notification ? [notification] : [];
            }
            resolve(notifications);
        } catch (e) {
            reject(e);
        }
    });
};

// Tạo notification mới
// Tạo notification mới
const createNewNotification = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // VALIDATION
            if (!data.id_schedule || !data.id_busstop || !data.id_driver || !data.message) {
                resolve({
                    errCode: 1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
                return;
            }

            await db.Notification.create({
                id_schedule: data.id_schedule,
                id_busstop: data.id_busstop,
                id_driver: data.id_driver,
                id_user: data.id_user,
                message: data.message,
                recipient_type: data.recipient_type || 'parent',
                notification_type: data.notification_type || 'bus_approaching'
            });

            resolve({
                errCode: 0,
                message: 'Tạo thông báo thành công!'
            });

        } catch (e) {
            reject(e);
        }
    });
};

// Xóa notification
const deleteNotification = (notificationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notification = await db.Notification.findOne({
                where: { id_notification: notificationId },
                raw: false,
            });

            if (!notification) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy thông báo!',
                });
            } else {
                await notification.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa thông báo thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy thông tin notification theo id
const getNotificationInfoById = (notificationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notification = await db.Notification.findOne({
                where: { id_notification: notificationId },
                include: [
                    {
                        model: db.Schedule,
                        as: 'schedule',
                        attributes: ['id_schedule', 'Sdate', 'Stime']
                    },
                    {
                        model: db.busStop,
                        as: 'busstop',
                        attributes: ['id_busstop', 'name_station']
                    },
                    {
                        model: db.Driver,
                        as: 'driver',
                        attributes: ['id_driver'],
                        include: [{
                            model: db.User,
                            as: 'user',
                            attributes: ['name']
                        }]
                    }
                ],
                raw: false,
                nest: true
            });

            if (!notification) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy thông báo!",
                    notification: {},
                });
            } else {
                resolve({
                    errCode: 0,
                    message: "Lấy thông tin thông báo thành công!",
                    notification: notification,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy notifications theo user (phụ huynh)
const getNotificationsByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    message: "Thiếu id người dùng!"
                });
                return;
            }

            const notifications = await db.Notification.findAll({
                where: {
                    [db.Sequelize.Op.or]: [
                        { id_user: userId },
                        { id_user: null, recipient_type: 'parent' }
                    ]
                },
                include: [
                    {
                        model: db.Schedule,
                        as: 'schedule',
                        attributes: ['id_schedule', 'Sdate', 'Stime']
                    },
                    {
                        model: db.busStop,
                        as: 'busstop',
                        attributes: ['id_busstop', 'name_station']
                    },
                    {
                        model: db.Driver,
                        as: 'driver',
                        attributes: ['id_driver'],
                        include: [{
                            model: db.User,
                            as: 'user',
                            attributes: ['name']
                        }]
                    },
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id_user', 'name', 'phone']
                    }
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                message: "Lấy danh sách thông báo thành công",
                notifications: notifications
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Lấy notifications cho admin
const getNotificationsForAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const notifications = await db.Notification.findAll({
                where: {
                    recipient_type: ['admin', 'all']
                },
                include: [
                    {
                        model: db.Schedule,
                        as: 'schedule',
                        attributes: ['id_schedule', 'Sdate', 'Stime']
                    },
                    {
                        model: db.busStop,
                        as: 'busstop',
                        attributes: ['id_busstop', 'name_station']
                    },
                    {
                        model: db.Driver,
                        as: 'driver',
                        attributes: ['id_driver'],
                        include: [{
                            model: db.User,
                            as: 'user',
                            attributes: ['name']
                        }]
                    }
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                message: "Lấy danh sách thông báo admin thành công",
                notifications: notifications
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    checkAndSendBusStopNotifications,
    getAllNotification,
    createNewNotification,
    deleteNotification,
    getNotificationInfoById,
    getNotificationsByUser,
    getNotificationsForAdmin
};