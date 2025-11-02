// const socketIO = require('socket.io');

// let io;

// const initSocketServer = (server) => {
//     io = socketIO(server, {
//         cors: {
//             origin: "*", // Hoặc chỉ định domain cụ thể
//             methods: ["GET", "POST"]
//         }
//     });

//     // Map để lưu thông tin tài xế đang online
//     const activeDrivers = new Map();

//     io.on('connection', (socket) => {
//         console.log('🔌 Client connected:', socket.id);

//         // 1. Tài xế đăng nhập và gửi GPS
//         socket.on('driver-login', (data) => {
//             const { driverId, driverName } = data;

//             activeDrivers.set(socket.id, {
//                 driverId,
//                 driverName,
//                 socketId: socket.id,
//                 lastUpdate: new Date()
//             });

//             console.log(`🚗 Tài xế ${driverName} (ID: ${driverId}) đã online`);

//             // Broadcast danh sách tài xế online
//             io.emit('drivers-online', Array.from(activeDrivers.values()));
//         });

//         // 2. Nhận GPS từ tài xế
//         socket.on('send-gps', async (data) => {
//             const { driverId, lat, lng, speed, heading, timestamp } = data;

//             console.log(`📍 GPS từ tài xế ${driverId}:`, { lat, lng });

//             // Cập nhật vị trí tài xế
//             const driver = activeDrivers.get(socket.id);
//             if (driver) {
//                 driver.lat = lat;
//                 driver.lng = lng;
//                 driver.speed = speed;
//                 driver.heading = heading;
//                 driver.lastUpdate = new Date();
//             }

//             // Broadcast vị trí tới tất cả admin/dashboard
//             io.emit('driver-location-update', {
//                 driverId,
//                 lat,
//                 lng,
//                 speed,
//                 heading,
//                 timestamp
//             });

//             // TODO: Lưu vào database nếu cần lịch sử
//             // await saveGPSHistory({ driverId, lat, lng, timestamp });
//         });

//         // 3. Admin yêu cầu vị trí tất cả tài xế
//         socket.on('request-all-drivers', () => {
//             const driversData = Array.from(activeDrivers.values())
//                 .filter(d => d.lat && d.lng);

//             socket.emit('all-drivers-location', driversData);
//         });

//         // 4. Ngắt kết nối
//         socket.on('disconnect', () => {
//             const driver = activeDrivers.get(socket.id);
//             if (driver) {
//                 console.log(`🚫 Tài xế ${driver.driverName} đã offline`);
//                 activeDrivers.delete(socket.id);
//                 io.emit('drivers-online', Array.from(activeDrivers.values()));
//             }
//         });
//     });

//     return io;
// };

// const getIO = () => {
//     if (!io) {
//         throw new Error('Socket.io chưa được khởi tạo!');
//     }
//     return io;
// };

// module.exports = { initSocketServer, getIO };