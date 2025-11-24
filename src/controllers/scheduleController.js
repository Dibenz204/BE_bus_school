

const scheduleService = require('../services/scheduleService');

// const getAllSchedules = async (req, res) => {
//     try {
//         const scheduleId = req.query.id_schedule || 'ALL';

//         // Lấy các filters từ query params
//         const filters = {};
//         if (req.query.id_driver) filters.id_driver = req.query.id_driver;
//         if (req.query.date) filters.date = req.query.date;
//         if (req.query.status) filters.status = req.query.status;

//         const schedules = await scheduleService.getAllSchedules(scheduleId, filters);

//         return res.status(200).json({
//             errCode: 0,
//             message: 'Lấy danh sách lịch trình thành công',
//             data: schedules
//         });
//     } catch (error) {
//         console.error('Error in getAllSchedules:', error);
//         return res.status(500).json({
//             errCode: 1,
//             message: 'Lỗi khi lấy danh sách lịch trình',
//             error: error.message
//         });
//     }
// };

const getAllSchedules = async (req, res) => {
    try {
        const scheduleId = req.query.id_schedule || 'ALL';

        // Lấy các filters từ query params
        const filters = {};
        if (req.query.id_driver) filters.id_driver = req.query.id_driver;
        if (req.query.id_route) filters.id_route = req.query.id_route;
        if (req.query.date) filters.date = req.query.date;
        if (req.query.status) filters.status = req.query.status;

        // Lấy các sort options
        const sortBy = {};
        if (req.query.sort_date) sortBy.date = req.query.sort_date;
        if (req.query.sort_time) sortBy.time = req.query.sort_time;
        if (req.query.sort_status) sortBy.status = req.query.sort_status;

        const schedules = await scheduleService.getAllSchedules(scheduleId, filters, sortBy);

        return res.status(200).json({
            errCode: 0,
            message: 'Lấy danh sách lịch trình thành công',
            data: schedules
        });
    } catch (error) {
        console.error('Error in getAllSchedules:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi lấy danh sách lịch trình',
            error: error.message
        });
    }
};


// Tạo schedule mới
// const createNewSchedule = async (req, res) => {
//     try {
//         const { id_route, id_driver, Stime, Sdate, status } = req.body;

//         if (!id_route || !id_driver || !Stime || !Sdate) {
//             return res.status(400).json({
//                 errCode: 1,
//                 message: "Thiếu thông tin bắt buộc: id_route, id_driver, Stime, Sdate!"
//             });
//         }

//         const result = await scheduleService.createNewSchedule({
//             id_route,
//             id_driver,
//             Stime,
//             Sdate,
//             status
//         });

//         return res.status(200).json(result);

//     } catch (e) {
//         console.error(e);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi server!",
//             error: e.message
//         });
//     }
// };

const createNewSchedule = async (req, res) => {
    try {
        const { id_route, id_driver, Stime, Sdate } = req.body; // Bỏ status

        if (!id_route || !id_driver || !Stime || !Sdate) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc: id_route, id_driver, Stime, Sdate!"
            });
        }

        const result = await scheduleService.createNewSchedule({
            id_route,
            id_driver,
            Stime,
            Sdate
            // Không truyền status, service sẽ tự động set "Đã lên lịch"
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

// Lấy danh sách status cho filter
const getScheduleStatuses = async (req, res) => {
    try {
        const statuses = await scheduleService.getScheduleStatuses();
        return res.status(200).json({
            errCode: 0,
            message: "Lấy danh sách trạng thái thành công!",
            data: statuses
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

// Xóa schedule - PHÙ HỢP VỚI FRONT-END
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.query.id_schedule; // Sửa thành query parameter

        if (!scheduleId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_schedule!"
            });
        }

        const result = await scheduleService.deleteSchedule(scheduleId);
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

// Cập nhật schedule - GIỮ NGUYÊN
const updateSchedule = async (req, res) => {
    try {
        const { id_schedule, id_route, id_driver, Stime, Sdate, status } = req.body;

        if (!id_schedule || !id_route || !id_driver || !Stime || !Sdate || !status) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc!"
            });
        }

        const result = await scheduleService.updateSchedule({
            id_schedule,
            id_route,
            id_driver,
            Stime,
            Sdate,
            status
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

// Lấy thông tin schedule theo ID - PHÙ HỢP VỚI FRONT-END
const getScheduleById = async (req, res) => {
    try {
        const scheduleId = req.query.id_schedule; // Sửa thành query parameter

        if (!scheduleId) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu tham số id_schedule!"
            });
        }

        const schedules = await scheduleService.getAllSchedules(scheduleId);

        if (schedules.length === 0) {
            return res.status(404).json({
                errCode: 1,
                message: "Không tìm thấy lịch trình!",
                data: null
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Lấy thông tin lịch trình thành công!",
            data: schedules[0]
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

// const updateStudentPickupStatus = async (req, res) => {
//     try {
//         const { id_schedule, id_student, status } = req.body;

//         // Validate required fields
//         if (!id_schedule || !id_student || !status) {
//             return res.status(400).json({
//                 errCode: 1,
//                 message: "Thiếu thông tin bắt buộc: id_schedule, id_student, status!"
//             });
//         }

//         // Validate status value
//         const validStatuses = ['Đang chờ', 'Có mặt', 'Đã đưa/đón'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({
//                 errCode: 1,
//                 message: "Trạng thái không hợp lệ! Trạng thái phải là: Đang chờ, Có mặt, hoặc Đã đưa/đón"
//             });
//         }

//         const result = await scheduleService.updateStudentPickupStatus(id_schedule, id_student, status);

//         return res.status(200).json(result);

//     } catch (error) {
//         console.error("Lỗi controller updateStudentPickupStatus:", error);
//         return res.status(500).json({
//             errCode: 1,
//             message: "Lỗi server!",
//             error: error.message
//         });
//     }
// };
const updateStudentPickupStatus = async (req, res) => {
    try {
        const { id_schedule, id_student, status } = req.body;

        // Validate required fields
        if (!id_schedule || !id_student || !status) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu thông tin bắt buộc: id_schedule, id_student, status!"
            });
        }

        // Validate status value
        const validStatuses = ['Đang chờ', 'Có mặt', 'Đã đưa/đón'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                errCode: 1,
                message: "Trạng thái không hợp lệ!"
            });
        }

        const result = await scheduleService.updateStudentPickupStatus(id_schedule, id_student, status);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi controller updateStudentPickupStatus:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server!",
            error: error.message
        });
    }
};

const autoUpdateScheduleStatus = async (req, res) => {
    try {
        const updatedCount = await scheduleService.autoUpdateScheduleStatus();

        return res.status(200).json({
            errCode: 0,
            message: `Đã tự động cập nhật ${updatedCount} lịch trình`,
            data: { updatedCount }
        });
    } catch (error) {
        console.error('Error in autoUpdateScheduleStatus:', error);
        return res.status(500).json({
            errCode: 1,
            message: 'Lỗi khi tự động cập nhật trạng thái',
            error: error.message
        });
    }
};

const getSchedulesByDriver = async (req, res) => {
    try {
        const idDriver = req.query.id_driver; // ⭐ Đổi từ params sang query

        if (!idDriver) {
            return res.status(400).json({
                errCode: 1,
                message: 'Thiếu id_driver'
            });
        }

        const result = await scheduleService.getSchedulesByDriver(idDriver);
        return res.status(200).json(result);

    } catch (e) {
        console.error('❌ Lỗi controller getSchedulesByDriver:', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Lỗi server'
        });
    }
};

module.exports = {
    getAllSchedules,
    createNewSchedule,
    deleteSchedule,
    updateSchedule,
    getScheduleById,
    updateStudentPickupStatus,
    autoUpdateScheduleStatus,
    getSchedulesByDriver,
    getScheduleStatuses
};