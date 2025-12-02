const db = require('../models/index.js');

const getAllRequests = (requestId, filters = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let requests = [];
            let whereClause = {};

            // Filter theo user
            if (filters.id_user) {
                whereClause.id_user = filters.id_user;
            }

            // Filter theo loại request
            if (filters.request_type) {
                whereClause.request_type = filters.request_type;
            }

            if (requestId === 'ALL') {
                requests = await db.Request.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email']
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                });
            } else if (requestId && requestId !== 'ALL') {
                whereClause.id_request = requestId;
                const request = await db.Request.findOne({
                    where: whereClause,
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email']
                        }
                    ]
                });
                requests = request ? [request] : [];
            }
            resolve(requests);
        } catch (e) {
            reject(e);
        }
    });
};

const createNewRequest = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Request.create({
                id_user: data.id_user,
                request_type: data.request_type,
                content: data.content
            });

            resolve({
                errCode: 0,
                message: 'Gửi yêu cầu thành công!'
            });

        } catch (e) {
            reject(e);
        }
    });
};

const deleteRequest = (requestId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await db.Request.findOne({
                where: { id_request: requestId },
                raw: false,
            });

            if (!request) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy yêu cầu!',
                });
            } else {
                await request.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa yêu cầu thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await db.Request.findOne({
                where: { id_request: data.id_request },
                raw: false,
            });

            if (!request) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy yêu cầu để cập nhật!",
                });
            } else {
                request.request_type = data.request_type;
                request.content = data.content;

                await request.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật yêu cầu thành công!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getRequestsByParent = (parentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!parentId) {
                resolve({
                    errCode: 1,
                    message: "Thiếu id phụ huynh!"
                });
                return;
            }

            const requests = await db.Request.findAll({
                where: { id_user: parentId },
                order: [['createdAt', 'DESC']]
            });

            resolve({
                errCode: 0,
                message: "Lấy danh sách yêu cầu thành công",
                data: requests
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllRequests,
    createNewRequest,
    deleteRequest,
    updateRequest,
    getRequestsByParent
};