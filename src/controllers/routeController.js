const routeService = require('../services/routeService.js');

// Lấy tất cả routes hoặc theo id
const handleGetAllRoute = async (req, res) => {
    try {
        let id = req.query.id_route || 'ALL';
        let routes = await routeService.getAllRoute(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Lấy dữ liệu thành công",
            routes
        });
    } catch (error) {
        console.error("Lỗi khi lấy routes:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy routes"
        });
    }
};

// Tạo route mới
const postCreateNewRoute = async (req, res) => {
    try {
        const message = await routeService.createNewRoute(req.body);
        console.log(message);
        return res.status(200).json(message);
    } catch (e) {
        console.error("Lỗi khi tạo route mới:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo route mới"
        });
    }
};

// Xóa route
const handleDeleteRoute = async (req, res) => {
    try {
        const routeId = req.query.id_route;

        if (!routeId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id tuyến đường!",
            });
        }

        const result = await routeService.deleteRoute(routeId);
        console.log(result);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xóa tuyến đường!",
        });
    }
};

// Cập nhật route
const handleUpdateRoute = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_route) {
            return res.status(400).json({
                errCode: 1,
                message: "Lỗi khi cập nhật tuyến đường!",
            });
        }

        const result = await routeService.updateRoute(data);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi cập nhật route:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi cập nhật tuyến đường!",
        });
    }
};

module.exports = {
    handleGetAllRoute,
    postCreateNewRoute,
    handleDeleteRoute,
    handleUpdateRoute
};