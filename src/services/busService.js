const db = require('../models/index.js');

const getAllBuses = (busId, filters = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let buses = [];
            let whereClause = {};

            // Nếu có filter theo driver
            if (filters.id_driver) {
                whereClause.id_driver = filters.id_driver;
            }

            // Nếu có filter theo route
            if (filters.id_route) {
                whereClause.id_route = filters.id_route;
            }

            if (busId === 'ALL') {
                buses = await db.Bus.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: db.Route,
                            as: 'route',
                            attributes: ['id_route', 'name_street']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver', 'toado_x', 'toado_y', 'id_user'],
                            include: [{
                                model: db.User,
                                as: 'user',
                                attributes: ['name']
                            }]
                        }
                    ],
                    order: [['id_bus', 'ASC']]
                });
            } else if (busId && busId !== 'ALL') {
                whereClause.id_bus = busId;
                const bus = await db.Bus.findOne({
                    where: whereClause,
                    include: [
                        {
                            model: db.Route,
                            as: 'route',
                            attributes: ['id_route', 'name_street']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver', 'toado_x', 'toado_y', 'id_user'],
                            include: [{
                                model: db.User,
                                as: 'user',
                                attributes: ['name']
                            }]
                        }
                    ]
                });
                buses = bus ? [bus] : [];
            }
            resolve(buses);
        } catch (e) {
            reject(e);
        }
    });
};

const createNewBus = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra biển số đã tồn tại chưa
            const existingBus = await db.Bus.findOne({
                where: { bien_so: data.bien_so }
            });

            if (existingBus) {
                resolve({
                    errCode: 1,
                    message: 'Biển số xe đã tồn tại!'
                });
                return;
            }

            // Kiểm tra driver đã có xe chưa
            const existingDriverBus = await db.Bus.findOne({
                where: { id_driver: data.id_driver }
            });

            if (existingDriverBus) {
                resolve({
                    errCode: 1,
                    message: 'Tài xế đã được phân công cho xe khác!'
                });
                return;
            }

            const newBus = await db.Bus.create({
                bien_so: data.bien_so,
                id_driver: data.id_driver,
                id_route: data.id_route
            });

            resolve({
                errCode: 0,
                message: 'Thêm xe bus thành công!',
                busId: newBus.id_bus
            });

        } catch (e) {
            reject(e);
        }
    });
};

const deleteBus = (busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const bus = await db.Bus.findOne({
                where: { id_bus: busId }
            });

            if (!bus) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy xe bus!',
                });
            } else {
                await bus.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa xe bus thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateBus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const bus = await db.Bus.findOne({
                where: { id_bus: data.id_bus }
            });

            if (!bus) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy xe bus để cập nhật!",
                });
            } else {
                // Kiểm tra biển số trùng (trừ chính nó)
                if (data.bien_so !== bus.bien_so) {
                    const existingBus = await db.Bus.findOne({
                        where: { bien_so: data.bien_so }
                    });

                    if (existingBus) {
                        resolve({
                            errCode: 1,
                            message: 'Biển số xe đã tồn tại!'
                        });
                        return;
                    }
                }

                // Kiểm tra driver trùng (trừ chính nó)
                if (data.id_driver !== bus.id_driver) {
                    const existingDriverBus = await db.Bus.findOne({
                        where: { id_driver: data.id_driver }
                    });

                    if (existingDriverBus) {
                        resolve({
                            errCode: 1,
                            message: 'Tài xế đã được phân công cho xe khác!'
                        });
                        return;
                    }
                }

                // Cập nhật thông tin
                bus.bien_so = data.bien_so;
                bus.id_driver = data.id_driver;
                bus.id_route = data.id_route;

                await bus.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật xe bus thành công!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy danh sách routes cho combobox
const getAllRoutes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const routes = await db.Route.findAll({
                attributes: ['id_route', 'name_street'],
                order: [['name_street', 'ASC']]
            });
            resolve(routes);
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy danh sách drivers cho combobox
const getAllDrivers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const drivers = await db.Driver.findAll({
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['name']
                }],
                attributes: ['id_driver'],
                raw: true,
                nest: true
            });

            // Format dữ liệu để lấy tên driver
            const formattedDrivers = drivers.map(driver => ({
                id_driver: driver.id_driver,
                driver_name: driver.user?.name || 'Không có tên'
            }));

            resolve(formattedDrivers);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createNewBus,
    getAllBuses,
    deleteBus,
    updateBus,
    getAllRoutes,
    getAllDrivers
};