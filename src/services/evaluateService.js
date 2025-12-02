const db = require('../models/index.js');

const getAllEvaluates = (evaluateId, filters = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let evaluates = [];
            let whereClause = {};

            // Filter theo user
            if (filters.id_user) {
                whereClause.id_user = filters.id_user;
            }

            // Filter theo schedule
            if (filters.id_schedule) {
                whereClause.id_schedule = filters.id_schedule;
            }

            // Filter theo số sao
            if (filters.star) {
                whereClause.star = filters.star;
            }

            if (evaluateId === 'ALL') {
                evaluates = await db.Evaluate.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email']
                        },
                        {
                            model: db.Schedule,
                            as: 'schedule',
                            attributes: ['id_schedule', 'Sdate', 'Stime'],
                            include: [{
                                model: db.Route,
                                as: 'routes',
                                attributes: ['id_route', 'name_street']
                            }]
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                });
            } else if (evaluateId && evaluateId !== 'ALL') {
                whereClause.id_evaluate = evaluateId;
                const evaluate = await db.Evaluate.findOne({
                    where: whereClause,
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email']
                        },
                        {
                            model: db.Schedule,
                            as: 'schedule',
                            attributes: ['id_schedule', 'Sdate', 'Stime'],
                            include: [{
                                model: db.Route,
                                as: 'routes',
                                attributes: ['id_route', 'name_street']
                            }]
                        }
                    ]
                });
                evaluates = evaluate ? [evaluate] : [];
            }
            resolve(evaluates);
        } catch (e) {
            reject(e);
        }
    });
};

const createNewEvaluate = async (data) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            // Kiểm tra schedule có tồn tại và đã hoàn thành không
            const schedule = await db.Schedule.findOne({
                where: {
                    id_schedule: data.id_schedule,
                    status: 'Hoàn thành'
                },
                transaction
            });

            if (!schedule) {
                await transaction.rollback();
                resolve({
                    errCode: 1,
                    message: 'Lịch trình không tồn tại hoặc chưa hoàn thành!'
                });
                return;
            }

            // Kiểm tra user có con trong schedule này không
            const studentInSchedule = await db.ScheduleStudent.findOne({
                where: { id_schedule: data.id_schedule },
                include: [{
                    model: db.Student,
                    as: 'student',
                    where: { id_user: data.id_user }
                }],
                transaction
            });

            if (!studentInSchedule) {
                await transaction.rollback();
                resolve({
                    errCode: 1,
                    message: 'Bạn không có con tham gia lịch trình này!'
                });
                return;
            }

            // Kiểm tra đã đánh giá chưa
            const existingEvaluate = await db.Evaluate.findOne({
                where: {
                    id_user: data.id_user,
                    id_schedule: data.id_schedule
                },
                transaction
            });

            if (existingEvaluate) {
                await transaction.rollback();
                resolve({
                    errCode: 2,
                    message: 'Bạn đã đánh giá lịch trình này rồi!'
                });
                return;
            }

            // Tạo đánh giá mới
            const newEvaluate = await db.Evaluate.create({
                id_user: data.id_user,
                id_schedule: data.id_schedule,
                star: data.star,
                content: data.content
            }, { transaction });

            await transaction.commit();

            resolve({
                errCode: 0,
                message: 'Đánh giá thành công!',
                evaluateId: newEvaluate.id_evaluate
            });

        } catch (e) {
            await transaction.rollback();
            reject(e);
        }
    });
};

const deleteEvaluate = (evaluateId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const evaluate = await db.Evaluate.findOne({
                where: { id_evaluate: evaluateId },
                raw: false,
            });

            if (!evaluate) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy đánh giá!',
                });
            } else {
                await evaluate.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa đánh giá thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateEvaluate = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const evaluate = await db.Evaluate.findOne({
                where: { id_evaluate: data.id_evaluate },
                raw: false,
            });

            if (!evaluate) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy đánh giá để cập nhật!",
                });
            } else {
                evaluate.star = data.star;
                evaluate.content = data.content;

                await evaluate.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật đánh giá thành công!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getEvaluatesByParent = (parentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!parentId) {
                resolve({
                    errCode: 1,
                    message: "Thiếu id phụ huynh!"
                });
                return;
            }

            const evaluates = await db.Evaluate.findAll({
                where: { id_user: parentId },
                include: [
                    {
                        model: db.Schedule,
                        as: 'schedule',
                        attributes: ['id_schedule', 'Sdate', 'Stime'],
                        include: [{
                            model: db.Route,
                            as: 'routes',
                            attributes: ['id_route', 'name_street']
                        }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            resolve({
                errCode: 0,
                message: "Lấy danh sách đánh giá thành công",
                data: evaluates
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllEvaluates,
    createNewEvaluate,
    deleteEvaluate,
    updateEvaluate,
    getEvaluatesByParent
};