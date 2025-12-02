const requestService = require('../services/requestService');


// console.log('✅ Request controller loaded');

const getAllRequests = async (req, res) => {
    try {
        const requestId = req.query.id_request || 'ALL';

        // Lấy các filters từ query params
        const filters = {};
        if (req.query.id_user) filters.id_user = req.query.id_user;
        if (req.query.request_type) filters.request_type = req.query.request_type;

        const requests = await requestService.getAllRequests(requestId, filters);

        return res.status(200).json({
            errCode: 0,
            message: 'Lấy danh sách yêu cầu thành công',
            data: requests
        });
    } catch (error) {
        console.error('Error in getAllRequests:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách yêu cầu',
            error: error.message
        });
    }
};

const createNewRequest = async (req, res) => {

    try {
        const { id_user, request_type, content } = req.body;

        if (!id_user || !request_type || !content) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc: id_user, request_type, content!"
            });
        }

        const validTypes = ['Xe bus', 'Trạm đón/trả', 'Tuyến đường', 'Khác'];
        if (!validTypes.includes(request_type)) {
            return res.status(400).json({
                errCode: 1,
                message: "Loại yêu cầu không hợp lệ!"
            });
        }

        const result = await requestService.createNewRequest({
            id_user,
            request_type,
            content
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

const deleteRequest = async (req, res) => {
    try {
        const requestId = req.query.id_request;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_request!"
            });
        }

        const result = await requestService.deleteRequest(requestId);
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

const updateRequest = async (req, res) => {
    try {
        const { id_request, request_type, content } = req.body;

        if (!id_request || !request_type || !content) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc!"
            });
        }

        const validTypes = ['Xe bus', 'Trạm đón/trả', 'Tuyến đường', 'Khác'];
        if (!validTypes.includes(request_type)) {
            return res.status(400).json({
                errCode: 1,
                message: "Loại yêu cầu không hợp lệ!"
            });
        }

        const result = await requestService.updateRequest({
            id_request,
            request_type,
            content
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

const getRequestById = async (req, res) => {
    try {
        const requestId = req.query.id_request;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_request!"
            });
        }

        const requests = await requestService.getAllRequests(requestId);

        if (requests.length === 0) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tìm thấy yêu cầu!",
                data: null
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Lấy thông tin yêu cầu thành công!",
            data: requests[0]
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

const getRequestsByParent = async (req, res) => {
    try {
        const parentId = req.query.id_user;

        if (!parentId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id phụ huynh!"
            });
        }

        const result = await requestService.getRequestsByParent(parentId);
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in getRequestsByParent:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách yêu cầu',
            error: error.message
        });
    }
};

module.exports = {
    getAllRequests,
    createNewRequest,
    deleteRequest,
    updateRequest,
    getRequestById,
    getRequestsByParent
};