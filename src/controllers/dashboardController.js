const dashboardService = require('../services/dashboardService.js');

// Lấy tổng số học sinh
const handleGetTotalStudents = async (req, res) => {
    try {
        const result = await dashboardService.getTotalStudents();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy tổng số học sinh:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy tổng số học sinh"
        });
    }
};

// Lấy tổng số người dùng
const handleGetTotalUsers = async (req, res) => {
    try {
        const result = await dashboardService.getTotalUsers();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy tổng số người dùng:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy tổng số người dùng"
        });
    }
};

// Lấy thống kê người dùng theo role
const handleGetUserStatsByRole = async (req, res) => {
    try {
        const result = await dashboardService.getUserStatsByRole();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy thống kê role:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thống kê role"
        });
    }
};

// Lấy tổng số trạm xe buýt
const handleGetTotalBusStops = async (req, res) => {
    try {
        const result = await dashboardService.getTotalBusStops();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy tổng số trạm:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy tổng số trạm"
        });
    }
};

// Lấy tổng số tuyến đường
const handleGetTotalRoutes = async (req, res) => {
    try {
        const result = await dashboardService.getTotalRoutes();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy tổng số tuyến đường:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy tổng số tuyến đường"
        });
    }
};

// Lấy thống kê học sinh theo tháng
const handleGetStudentsByMonth = async (req, res) => {
    try {
        const year = req.query.year ? parseInt(req.query.year) : null;
        const result = await dashboardService.getStudentsByMonth(year);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy thống kê học sinh theo tháng:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thống kê học sinh theo tháng"
        });
    }
};

// Lấy danh sách các năm có dữ liệu
const handleGetAvailableYears = async (req, res) => {
    try {
        const result = await dashboardService.getAvailableYears();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy danh sách năm:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy danh sách năm"
        });
    }
};

// Lấy thống kê học sinh theo tuyến đường
const handleGetStudentsByRoute = async (req, res) => {
    try {
        const result = await dashboardService.getStudentsByRoute();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy thống kê học sinh theo tuyến:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thống kê học sinh theo tuyến"
        });
    }
};


// Lấy tất cả thống kê một lần (recommended)
const handleGetAllDashboardStats = async (req, res) => {
    try {
        const result = await dashboardService.getAllDashboardStats();
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi lấy thống kê dashboard:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thống kê dashboard"
        });
    }
};

module.exports = {
    handleGetTotalStudents,
    handleGetTotalUsers,
    handleGetUserStatsByRole,
    handleGetTotalBusStops,
    handleGetTotalRoutes,
    handleGetStudentsByMonth,
    handleGetAvailableYears,
    handleGetStudentsByRoute,
    handleGetAllDashboardStats
};