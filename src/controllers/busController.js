const busService = require('../services/busService');

const getAllBuses = async (req, res) => {
    try {
        const busId = req.query.id_bus || 'ALL';

        // Lấy các filters từ query params
        const filters = {};
        if (req.query.id_driver) filters.id_driver = req.query.id_driver;
        if (req.query.id_route) filters.id_route = req.query.id_route;

        const buses = await busService.getAllBuses(busId, filters);

        return res.status(200).json({
            errCode: 0,
            message: 'Lấy danh sách xe bus thành công',
            data: buses
        });
    } catch (error) {
        console.error('Error in getAllBuses:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách xe bus',
            error: error.message
        });
    }
};

const createNewBus = async (req, res) => {
    try {
        const { bien_so, id_driver, id_route } = req.body;

        if (!bien_so || !id_driver || !id_route) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc: biển số, tài xế, tuyến đường!"
            });
        }

        const result = await busService.createNewBus({
            bien_so,
            id_driver,
            id_route
        });

        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

const deleteBus = async (req, res) => {
    try {
        const busId = req.query.id_bus;

        if (!busId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_bus!"
            });
        }

        const result = await busService.deleteBus(busId);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

const updateBus = async (req, res) => {
    try {
        const { id_bus, bien_so, id_driver, id_route } = req.body;

        if (!id_bus || !bien_so || !id_driver || !id_route) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc!"
            });
        }

        const result = await busService.updateBus({
            id_bus,
            bien_so,
            id_driver,
            id_route
        });

        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

const getBusById = async (req, res) => {
    try {
        const busId = req.query.id_bus;

        if (!busId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_bus!"
            });
        }

        const buses = await busService.getAllBuses(busId);

        if (buses.length === 0) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tìm thấy xe bus!",
                data: null
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Lấy thông tin xe bus thành công!",
            data: buses[0]
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

const getRoutes = async (req, res) => {
    try {
        const routes = await busService.getAllRoutes();
        return res.status(200).json({
            errCode: 0,
            message: "Lấy danh sách tuyến đường thành công!",
            data: routes
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

const getDrivers = async (req, res) => {
    try {
        const drivers = await busService.getAllDrivers();
        return res.status(200).json({
            errCode: 0,
            message: "Lấy danh sách tài xế thành công!",
            data: drivers
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: e.message
        });
    }
};

module.exports = {
    getAllBuses,
    createNewBus,
    deleteBus,
    updateBus,
    getBusById,
    getRoutes,
    getDrivers
};