const evaluateService = require('../services/evaluateService');

const getAllEvaluates = async (req, res) => {
    try {
        const evaluateId = req.query.id_evaluate || 'ALL';

        // Lấy các filters từ query params
        const filters = {};
        if (req.query.id_user) filters.id_user = req.query.id_user;
        if (req.query.id_schedule) filters.id_schedule = req.query.id_schedule;
        if (req.query.star) filters.star = parseInt(req.query.star);

        const evaluates = await evaluateService.getAllEvaluates(evaluateId, filters);

        return res.status(200).json({
            errCode: 0,
            message: 'Lấy danh sách đánh giá thành công',
            data: evaluates
        });
    } catch (error) {
        console.error('Error in getAllEvaluates:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách đánh giá',
            error: error.message
        });
    }
};

const createNewEvaluate = async (req, res) => {
    try {
        const { id_user, id_schedule, star, content } = req.body;

        if (!id_user || !id_schedule || !star) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc: id_user, id_schedule, star!"
            });
        }

        if (star < 1 || star > 5) {
            return res.status(400).json({
                errCode: 1,
                message: "Số sao phải từ 1 đến 5!"
            });
        }

        const result = await evaluateService.createNewEvaluate({
            id_user,
            id_schedule,
            star,
            content: content || ''
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

const deleteEvaluate = async (req, res) => {
    try {
        const evaluateId = req.query.id_evaluate;

        if (!evaluateId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_evaluate!"
            });
        }

        const result = await evaluateService.deleteEvaluate(evaluateId);
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

const updateEvaluate = async (req, res) => {
    try {
        const { id_evaluate, star, content } = req.body;

        if (!id_evaluate || !star) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc!"
            });
        }

        if (star < 1 || star > 5) {
            return res.status(400).json({
                errCode: 1,
                message: "Số sao phải từ 1 đến 5!"
            });
        }

        const result = await evaluateService.updateEvaluate({
            id_evaluate,
            star,
            content: content || ''
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

const getEvaluateById = async (req, res) => {
    try {
        const evaluateId = req.query.id_evaluate;

        if (!evaluateId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_evaluate!"
            });
        }

        const evaluates = await evaluateService.getAllEvaluates(evaluateId);

        if (evaluates.length === 0) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tìm thấy đánh giá!",
                data: null
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Lấy thông tin đánh giá thành công!",
            data: evaluates[0]
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

const getEvaluatesByParent = async (req, res) => {
    try {
        const parentId = req.query.id_user;

        if (!parentId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id phụ huynh!"
            });
        }

        const result = await evaluateService.getEvaluatesByParent(parentId);
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in getEvaluatesByParent:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách đánh giá',
            error: error.message
        });
    }
};

module.exports = {
    getAllEvaluates,
    createNewEvaluate,
    deleteEvaluate,
    updateEvaluate,
    getEvaluateById,
    getEvaluatesByParent
};