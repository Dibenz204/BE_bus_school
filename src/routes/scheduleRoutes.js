const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Lấy tất cả schedules hoặc schedule theo query parameter
router.get('/get-schedules', scheduleController.getAllSchedules);

// Lấy schedule theo ID (query parameter)
router.get('/get-schedule', scheduleController.getScheduleById);

// Tạo schedule mới
router.post('/create-schedule', scheduleController.createNewSchedule);

// Cập nhật schedule
router.put('/update-schedule', scheduleController.updateSchedule);

// Xóa schedule (query parameter)
router.delete('/delete-schedule', scheduleController.deleteSchedule);

//Thay đổi status khi học sinh lên xe, xuống xe --> schedule_student
router.put('/update-student-status', scheduleController.updateStudentPickupStatus);

// Tự động cập nhật trạng thái schedule khi tới giờ (status: đã lên lịch, vận hành, hoàn thành)
router.get('/auto-update-status', scheduleController.autoUpdateScheduleStatus);

//Dùng để lấy schedule driver để render ra map
router.get('/get-schedule-by-driver', scheduleController.getSchedulesByDriver);

module.exports = router;