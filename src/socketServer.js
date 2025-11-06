const socketIO = require('socket.io');
const db = require('./models/index.js');

let io = null;

const initSocketServer = (server) => {
    io = socketIO(server, {
        cors: {
            origin: [
                'http://localhost:5173',
                'http://localhost:3000',
                'https://test-frontend-bus-school.vercel.app'
            ],
            credentials: true,
            methods: ["GET", "POST"]
        },
        transports: ['websocket', 'polling'], // Hỗ trợ cả websocket và polling cho Render
        pingTimeout: 60000,
        pingInterval: 25000
    });

    // Namespace cho GPS tracking
    const gpsNamespace = io.of('/gps');


    gpsNamespace.on('connection', (socket) => {
        console.log('🚗 Client connected:', socket.id);

        socket.on('register-driver', (data) => {
            const { id_driver } = data;
            socket.driverId = id_driver;

            // Thông báo driver online
            socket.broadcast.emit('driver-connected', { id_driver });
            console.log(`🟢 Driver ${id_driver} registered`);
        });

        socket.on('update-location', async (data) => {
            try {
                const { id_driver, toado_x, toado_y, id_user } = data;

                console.log(`📍 Location update from ${id_driver}:`, { toado_x, toado_y });

                // Lưu vào database - CẦN INCLUDE USER
                const driver = await db.Driver.findOne({
                    where: { id_driver: id_driver },
                    include: [{
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'phone']
                    }],
                    raw: false
                });

                if (driver && driver.user) {
                    driver.toado_x = toado_x;
                    driver.toado_y = toado_y;
                    await driver.save();

                    // Broadcast tới TẤT CẢ clients
                    gpsNamespace.emit('driver-location-updated', {
                        id_driver,
                        toado_x,
                        toado_y,
                        driver_name: driver.user.name,
                        driver_phone: driver.user.phone,
                        timestamp: driver.updatedAt
                    });

                    console.log(`✅ Location updated and broadcasted for ${id_driver} - ${driver.user.name}`);
                } else {
                    console.log(`❌ Driver ${id_driver} or user not found`);
                }

            } catch (error) {
                console.error('❌ Error updating location:', error);
                socket.emit('location-error', {
                    message: 'Lỗi cập nhật vị trí'
                });
            }
        });

        socket.on('toggle-gps-status', async (data) => {
            try {
                const { id_driver, status } = data;

                const driver = await db.Driver.findOne({
                    where: { id_driver },
                    include: [{
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'phone']
                    }],
                    raw: false
                });

                if (driver && driver.user) {
                    driver.status = status;
                    await driver.save();

                    // Thông báo trạng thái tới tất cả clients
                    gpsNamespace.emit('driver-status-changed', {
                        id_driver,
                        status,
                        driver_name: driver.user.name,
                        driver_phone: driver.user.phone,
                        timestamp: new Date().toISOString()
                    });

                    console.log(`🔄 Driver ${id_driver} (${driver.user.name}) GPS status: ${status ? 'ON' : 'OFF'}`);
                }
            } catch (error) {
                console.error('❌ Error toggling GPS status:', error);
            }
        });

        // ✅ FIX: Chỉ 1 sự kiện disconnect
        socket.on('disconnect', () => {
            if (socket.driverId) {
                // Thông báo driver offline
                socket.broadcast.emit('driver-disconnected', { id_driver: socket.driverId });
                console.log(`🔴 Driver ${socket.driverId} disconnected`);
            }
            console.log('🔴 Client disconnected:', socket.id);
        });

        // Ping/Pong để giữ connection alive
        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

    // gpsNamespace.on('connection', (socket) => {
    //     console.log('🚗 Driver connected:', socket.id);

    // Driver gửi vị trí realtime
    // socket.on('update-location', async (data) => {
    //     try {
    //         const { id_driver, toado_x, toado_y, id_user } = data;

    //         console.log(`📍 Location update from ${id_driver}:`, { toado_x, toado_y });

    //         // Lưu vào database
    //         const driver = await db.Driver.findOne({
    //             where: { id_driver: id_driver },
    //             raw: false
    //         });

    //         if (driver) {
    //             driver.toado_x = toado_x;
    //             driver.toado_y = toado_y;
    //             await driver.save();

    //             // Broadcast tới TẤT CẢ clients (Admin, phụ huynh đang xem map)
    //             gpsNamespace.emit('driver-location-updated', {
    //                 id_driver,
    //                 toado_x,
    //                 toado_y,
    //                 timestamp: driver.updatedAt
    //             });

    //             console.log(`✅ Location updated and broadcasted for ${id_driver}`);
    //         } else {
    //             console.log(`❌ Driver ${id_driver} not found`);
    //         }

    //     } catch (error) {
    //         console.error('❌ Error updating location:', error);
    //         socket.emit('location-error', {
    //             message: 'Lỗi cập nhật vị trí'
    //         });
    //     }
    // });

    // Driver bật/tắt GPS
    // socket.on('toggle-gps-status', async (data) => {
    //     try {
    //         const { id_driver, status } = data;

    //         const driver = await db.Driver.findOne({
    //             where: { id_driver },
    //             raw: false
    //         });

    //         if (driver) {
    //             driver.status = status;
    //             await driver.save();

    //             // Thông báo trạng thái tới tất cả clients
    //             gpsNamespace.emit('driver-status-changed', {
    //                 id_driver,
    //                 status,
    //                 timestamp: new Date().toISOString()
    //             });

    //             console.log(`🔄 Driver ${id_driver} GPS status: ${status ? 'ON' : 'OFF'}`);
    //         }
    //     } catch (error) {
    //         console.error('❌ Error toggling GPS status:', error);
    //     }
    // });

    // Khi driver disconnect
    // socket.on('disconnect', () => {
    //     console.log('🔴 Driver disconnected:', socket.id);
    // });

    // // Ping/Pong để giữ connection alive (quan trọng với Render)
    // socket.on('ping', () => {
    //     socket.emit('pong');
    // });
    // });

    console.log('✅ Socket.IO server initialized on /gps namespace');
    return io;
};

// Export để sử dụng ở nơi khác nếu cần
const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO chưa được khởi tạo!');
    }
    return io;
};

module.exports = { initSocketServer, getIO };