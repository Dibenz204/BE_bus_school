const db = require('../models/index.js');
const routeBusStopService = require('../services/routeBusstopService.js');

const getBusStopsByRoute = async (req, res) => {
    try {
        const routeId = req.query.id_route;
        if (!routeId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id route!"
            });
        }
        const result = await routeBusStopService.getBusStopsByRoute(routeId);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!"
        });
    }
};

const saveRouteBusStops = async (req, res) => {
    try {
        // console.log("📥 Received data:", req.body); //  Thêm dòng này

        const { id_route, busStops } = req.body;

        // console.log("🔍 id_route:", id_route); //  Thêm dòng này
        // console.log("🔍 busStops:", busStops); //  Thêm dòng này

        if (!id_route || !busStops || !Array.isArray(busStops)) {
            return res.status(400).json({
                errCode: 1,
                message: "Dữ liệu không hợp lệ!"
            });
        }
        const result = await routeBusStopService.saveRouteBusStops(id_route, busStops);
        // console.log("✅ Result:", result); //  Thêm dòng này
        return res.status(200).json(result);
    } catch (e) {
        // console.error("❌ Lỗi chi tiết:", e); //  Sửa dòng này
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!"
        });
    }
};

module.exports = {
    getBusStopsByRoute,
    saveRouteBusStops
};