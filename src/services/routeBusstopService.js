const db = require('../models/index.js');

const getBusStopsByRoute = (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("🔍 Getting bus stops for route:", routeId); //  Thêm log

            const routeBusStops = await db.RouteBusStop.findAll({
                where: { id_route: routeId },
                include: [{
                    model: db.busStop,
                    as: 'busStop'
                }],
                order: [['stt_busstop', 'ASC']],
                raw: false
            });

            // console.log("✅ Found bus stops:", routeBusStops.length); //  Thêm log

            resolve({
                errCode: 0,
                data: routeBusStops
            });
        } catch (e) {
            // console.error("❌ Error in getBusStopsByRoute:", e); //  Thêm log
            reject(e);
        }
    });
};

const saveRouteBusStops = (routeId, busStops) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("🔍 Saving route:", routeId); //  Thêm log
            // console.log("🔍 Bus stops:", busStops); //  Thêm log

            // Xóa hết trạm cũ của route
            await db.RouteBusStop.destroy({
                where: { id_route: routeId }
            });

            // console.log("✅ Deleted old bus stops"); //  Thêm log

            // Thêm lại trạm mới theo thứ tự
            const promises = busStops.map((busStopId, index) => {
                // console.log(`➕ Creating: route=${routeId}, busstop=${busStopId}, stt=${index + 1}`); //  Thêm log phòng trường hợp lỗi
                return db.RouteBusStop.create({
                    id_route: routeId,
                    id_busstop: busStopId,
                    stt_busstop: index + 1
                });
            });

            await Promise.all(promises);

            // console.log("✅ Saved all bus stops"); //  Thêm log phòng trường hợp lỗi

            resolve({
                errCode: 0,
                message: 'Lưu trạm vào route thành công!'
            });
        } catch (e) {
            console.error("❌ Error in saveRouteBusStops:", e); // ← Thêm log
            reject(e);
        }
    });
};

module.exports = {
    getBusStopsByRoute,
    saveRouteBusStops
};