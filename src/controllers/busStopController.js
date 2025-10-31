
const busStopService = require('../services/busStopService');

const postCreateBusStop = async (req, res) => {
    try {
        console.log('📥 Received data:', req.body);
        const message = await busStopService.createBusStop(req.body);
        console.log('✅ Service response:', message);
        return res.status(200).json(message);
    } catch (e) {
        console.error("❌ Lỗi khi tạo trạm:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo trạm"
        });
    }
};

const getAllBusStops = async (req, res) => {
    try {
        const { visible } = req.query;  // ← Lấy visible từ query param
        const data = await busStopService.getAllBusStops(visible);
        return res.status(200).json(data);
    } catch (e) {
        console.error("❌ Lỗi khi lấy danh sách trạm:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy danh sách trạm"
        });
    }
};

const deleteBusStop = async (req, res) => {
    try {
        const message = await busStopService.deleteBusStop(req.params.id);
        return res.status(200).json(message);
    } catch (e) {
        console.error("❌ Lỗi khi xóa trạm:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi xóa trạm"
        });
    }
};

module.exports = {
    postCreateBusStop,
    getAllBusStops,
    deleteBusStop
};