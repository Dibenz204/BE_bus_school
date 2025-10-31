const db = require('../models/index.js');

// Lấy tất cả routes hoặc 1 route theo id
const getAllRoute = (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let routes = [];
            if (routeId === 'ALL') {
                routes = await db.Route.findAll({
                    raw: true
                });
            } else if (routeId && routeId !== 'ALL') {
                const route = await db.Route.findOne({
                    where: { id_route: routeId },
                    raw: true
                });
                routes = route ? [route] : [];
            }
            resolve(routes);
        } catch (e) {
            reject(e);
        }
    });
};

// Tạo route mới
const createNewRoute = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Route.create({
                name_street: data.name_street
            });

            resolve({
                errCode: 0,
                message: 'Tạo tuyến đường thành công!'
            });

        } catch (e) {
            reject(e);
        }
    });
};

// Xóa route
const deleteRoute = (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const route = await db.Route.findOne({
                where: { id_route: routeId },
                raw: false,
            });

            if (!route) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy tuyến đường!',
                });
            } else {
                await route.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa tuyến đường thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy thông tin route theo id
const getRouteInfoById = (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const route = await db.Route.findOne({
                where: { id_route: routeId },
                raw: true,
            });

            if (!route) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy tuyến đường!",
                    route: {},
                });
            } else {
                resolve({
                    errCode: 0,
                    message: "Lấy thông tin tuyến đường thành công!",
                    route: route,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật route
const updateRoute = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const route = await db.Route.findOne({
                where: { id_route: data.id_route },
                raw: false,
            });

            if (!route) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy tuyến đường để cập nhật!",
                });
            } else {
                route.name_street = data.name_street;
                await route.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật thông tin tuyến đường thành công!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllRoute,
    createNewRoute,
    deleteRoute,
    getRouteInfoById,
    updateRoute
};