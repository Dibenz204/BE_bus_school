

const { raw } = require('body-parser');
const db = require('../models/index');
const { where } = require('sequelize');

const createDriver = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingDriver = await db.Driver.findOne({
                where: { id_driver: data.id_driver }
            });

            if (existingDriver) {
                return resolve({
                    errCode: 1,
                    message: 'Mã tài xế đã tồn tại!'
                });
            }

            await db.Driver.create({
                toado_x: data.toado_x,
                toado_y: data.toado_y,
                id_user: data.id_user,
                status: data.status || true
            })

        }
        catch (e) {
            reject(e);
        }
    })
};

const getAllDrivers = async (driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let drivers = [];
            if (driverId === 'ALL') {
                drivers = await db.Driver.findAll({
                    raw: true,
                    attributes: { exclude: [password] }
                });
            }

            else if (driverId && driverId !== 'ALL') {
                const driver = await db.Driver.findOne({
                    where: { id_driver: driverId },
                    raw: true,
                    attributes: { exclude: [password] }
                });
                drivers = driver ? [driver] : [];
            }
            resolver(drivers)
        }
        catch (e) {
            reject(e);
        }
    })
};

const getDriverInfoById = async (driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const driver = await db.Driver.findOne({
                where: { id_driver: driverId },
                raw: true,
            });

            if (!driver) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy tài xế",
                    driver: {},
                })
            }
            else {
                resolve({
                    errCode: 0,
                    message: "Lấy thông tin tài xế" + driverId + "thành công",
                    driver: driver,
                });
            }
        }
        catch (e) {
            reject(e);
        }
    })
};

const deleteDriver = async (driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const driver = await db.Driver.findOne({
                where: { id_driver: driverId },
                raw: false,
            });

            if (!driver) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy tài xế!",
                });
            }

            else {
                await driver.destroy();
                resolve({
                    errCode: 0,
                    message: "Xóa tài xế thành công!",
                });
            }
        }
        catch (e) {
            reject(e);
        }
    })

}

const updateDriverStatus = async (driverId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            const driver = await db.Driver.findOne({
                where: { id_driver: driverId },
                raw: false, // cần false để có thể gọi .save()
            });

            if (!driver) {
                return resolve({
                    errCode: 1,
                    message: "Không tìm thấy tài xế!"
                });
            }

            driver.status = newStatus; // đổi trạng thái
            await driver.save(); // lưu lại DB

            resolve({
                errCode: 0,
                message: `Cập nhật trạng thái tài xế ${driverId} thành công!`,
                driver: driver
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateDriver = async (driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const driver = await db.Driver.findOne({
                where: { id_driver: driverId },
                raw: false, // cần raw: false để có thể .save()
            });

            if (!driver) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy tài xế để cập nhật!",
                });
            }

            else {
                driver.toado_x = data.toado_x;
                driver.toado_y = data.toado_y;
                await driver.save();
                resolve({
                    errCode: 0,
                    message: "Cập nhật tài xế thành công!",
                });
            }
        }
        catch (e) {
            reject(e);
        }
    })
};

const updateDriverLocation = async (driverId, toado_x, toado_y) => {
    return new Promise(async (resolve, reject) => {
        try {
            const driver = await db.Driver.findOne({
                where: { id_driver: driverId },
                raw: false
            });

            if (!driver) {
                return resolve({
                    errCode: 1,
                    message: "Không tìm thấy tài xế!"
                });
            }

            driver.toado_x = toado_x;
            driver.toado_y = toado_y;
            await driver.save();

            resolve({
                errCode: 0,
                message: "Cập nhật vị trí thành công!",
                driver: {
                    id_driver: driver.id_driver,
                    toado_x: driver.toado_x,
                    toado_y: driver.toado_y,
                    updatedAt: driver.updatedAt
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllDriverLocations = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const drivers = await db.Driver.findAll({
                attributes: ['id_driver', 'toado_x', 'toado_y', 'status', 'updatedAt'],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['name', 'phone', 'email'] // ✅ SỬA: name chứ không phải fullname
                    }
                ],
                raw: true,
                nest: true
            });

            const locations = drivers.map(driver => ({
                id_driver: driver.id_driver,
                toado_x: driver.toado_x,
                toado_y: driver.toado_y,
                status: driver.status,
                driver_name: driver.user?.name || "Không rõ",
                driver_phone: driver.user?.phone || "Không có",
                driver_email: driver.user?.email || "Không có",
                last_updated: driver.updatedAt
            }));

            resolve({
                errCode: 0,
                message: "Lấy vị trí tài xế thành công",
                locations
            });
        } catch (e) {
            console.error("❌ Lỗi trong getAllDriverLocations:", e);
            reject(e);
        }
    });
};

module.exports = {
    createDriver,
    getAllDrivers,
    getDriverInfoById,
    deleteDriver,
    updateDriverStatus,
    updateDriver,
    updateDriverLocation,
    getAllDriverLocations
};