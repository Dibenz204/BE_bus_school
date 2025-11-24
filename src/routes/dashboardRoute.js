const express = require('express');
const dashboardController = require('../controllers/dashboardController.js');

const router = express.Router();

// Route lấy tổng số học sinh
router.get('/total-students', dashboardController.handleGetTotalStudents);

// Route lấy tổng số người dùng
router.get('/total-users', dashboardController.handleGetTotalUsers);

// Route lấy tổng số trạm xe buýt
router.get('/total-busstops', dashboardController.handleGetTotalBusStops);

// Route lấy tổng số tuyến đường
router.get('/total-routes', dashboardController.handleGetTotalRoutes);

// Route lấy thống kê người dùng theo role (cho PieChart)
router.get('/user-stats-by-role', dashboardController.handleGetUserStatsByRole);

// Route lấy thống kê học sinh theo tháng (cho LineChart)
router.get('/students-by-month', dashboardController.handleGetStudentsByMonth);

// Route lấy danh sách các năm có dữ liệu
router.get('/available-years', dashboardController.handleGetAvailableYears);

// Route lấy thống kê học sinh theo tuyến đường (cho BarChart)
router.get('/students-by-route', dashboardController.handleGetStudentsByRoute);

// Route lấy tất cả thống kê một lần (recommended - giảm số lần gọi API)
router.get('/all-stats', dashboardController.handleGetAllDashboardStats);

module.exports = router;