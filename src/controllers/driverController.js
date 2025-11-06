
const db = require('../models/index.js');
const driverService = require('../services/driverService.js');

// ✅ Lấy tất cả tài xế hoặc 1 tài xế cụ thể
const handleGetAllDrivers = async (req, res) => {
    try {
        const driverId = req.query.id_driver; // nếu có id thì lấy 1, nếu ALL thì lấy hết
        const drivers = await driverService.getAllDrivers(driverId);

        return res.status(200).json({
            errCode: 0,
            message: "Lấy danh sách tài xế thành công",
            drivers
        });
    } catch (e) {
        console.error("❌ Lỗi khi lấy danh sách tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy danh sách tài xế"
        });
    }
};

// ✅ Lấy thông tin chi tiết 1 tài xế
const handleGetDriverInfoById = async (req, res) => {
    try {
        const driverId = req.query.id_driver;
        if (!driverId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id_driver trong query!"
            });
        }

        const result = await driverService.getDriverInfoById(driverId);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy thông tin tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy thông tin tài xế"
        });
    }
};

// ✅ Tạo mới tài xế
const handleCreateDriver = async (req, res) => {
    try {
        const data = req.body;
        const result = await driverService.createDriver(data);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi tạo tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo tài xế"
        });
    }
};

// ✅ Xóa tài xế
const handleDeleteDriver = async (req, res) => {
    try {
        const driverId = req.query.id_driver;
        if (!driverId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id_driver!"
            });
        }

        const result = await driverService.deleteDriver(driverId);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi xóa tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi xóa tài xế"
        });
    }
};

// ✅ Cập nhật trạng thái tài xế (hoạt động/ngưng hoạt động)
const handleUpdateDriverStatus = async (req, res) => {
    try {
        const { id_driver, status } = req.body;
        if (!id_driver || typeof status === 'undefined') {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id_driver hoặc status!"
            });
        }

        const result = await driverService.updateDriverStatus(id_driver, status);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi cập nhật trạng thái tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi cập nhật trạng thái tài xế"
        });
    }
};

const handleUpdateDriver = async (req, res) => {
    try {
        const driverId = req.body.id_driver;
        const data = req.body;

        if (!driverId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id_driver để cập nhật!",
            });
        }

        const result = await driverService.updateDriver(driverId, data);

        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi cập nhật tài xế:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi cập nhật tài xế!",
        });
    }
};

const handleUpdateDriverLocation = async (req, res) => {
    try {
        const { id_driver, toado_x, toado_y } = req.body;

        if (!id_driver || !toado_x || !toado_y) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id_driver, toado_x hoặc toado_y!"
            });
        }

        const result = await driverService.updateDriverLocation(id_driver, toado_x, toado_y);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi cập nhật location:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi cập nhật location!"
        });
    }
};

// ✅✅✅ MỚI: Lấy location của tất cả driver (cho Admin/Phụ huynh xem map)
const handleGetAllDriverLocations = async (req, res) => {
    try {
        const drivers = await db.Driver.findAll({
            attributes: ['id_driver', 'toado_x', 'toado_y', 'status', 'updatedAt'],
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['name', 'phone']
            }],
            raw: false
        });

        const locations = drivers.map(driver => ({
            id_driver: driver.id_driver,
            toado_x: driver.toado_x,
            toado_y: driver.toado_y,
            status: driver.status,
            driver_name: driver.user?.name || 'Unknown',
            driver_phone: driver.user?.phone || 'N/A',
            last_updated: driver.updatedAt
        }));

        return res.status(200).json({
            errCode: 0,
            message: "Lấy vị trí tài xế thành công",
            locations
        });

    } catch (e) {
        console.error("❌ Lỗi khi lấy locations:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy locations!"
        });
    }
};


// ✅ Xuất module
module.exports = {
    handleGetAllDrivers,
    handleGetDriverInfoById,
    handleCreateDriver,
    handleDeleteDriver,
    handleUpdateDriverStatus,
    handleUpdateDriver,
    handleUpdateDriverLocation,
    handleGetAllDriverLocations
};
