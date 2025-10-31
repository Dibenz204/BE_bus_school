const db = require('../models/index');

const createBusStop = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingStop = await db.busStop.findOne({
                where: { name_station: data.name_station }
            });

            if (existingStop) {
                return resolve({
                    errCode: 1,
                    message: 'Tên trạm đã tồn tại!'
                });
            }

            await db.busStop.create({
                name_station: data.name_station,
                toado_x: data.toado_x,
                toado_y: data.toado_y,
                describe: data.describe || '',
                visible: data.visible || 0  // ← Thêm visible
            });

            resolve({
                errCode: 0,
                message: 'Tạo trạm xe buýt thành công!'
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllBusStops = async (visibleFilter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tạo điều kiện where dựa trên filter
            let whereCondition = {};

            if (visibleFilter === '0' || visibleFilter === '1') {
                whereCondition.visible = parseInt(visibleFilter);
            }
            // Nếu visibleFilter === 'all' hoặc undefined thì không filter

            const busStops = await db.busStop.findAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']]
            });

            resolve({
                errCode: 0,
                data: busStops
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteBusStop = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const busStop = await db.busStop.findOne({
                where: { id_busstop: id }
            });

            if (!busStop) {
                return resolve({
                    errCode: 1,
                    message: 'Trạm không tồn tại!'
                });
            }

            await db.busStop.destroy({
                where: { id_busstop: id }
            });

            resolve({
                errCode: 0,
                message: 'Xóa trạm thành công!'
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createBusStop,
    getAllBusStops,
    deleteBusStop
};