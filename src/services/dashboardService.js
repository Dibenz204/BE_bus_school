const db = require('../models/index.js');

// Lấy tổng số học sinh
const getTotalStudents = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await db.Student.count();
            resolve({
                errCode: 0,
                message: "Lấy tổng số học sinh thành công",
                total: count
            });
        } catch (e) {
            console.error("❌ Lỗi khi đếm học sinh:", e);
            reject(e);
        }
    });
};

// Lấy tổng số người dùng (tất cả role)
const getTotalUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await db.User.count();
            resolve({
                errCode: 0,
                message: "Lấy tổng số người dùng thành công",
                total: count
            });
        } catch (e) {
            console.error("❌ Lỗi khi đếm người dùng:", e);
            reject(e);
        }
    });
};

// Lấy thống kê người dùng theo role (cho PieChart)
const getUserStatsByRole = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const stats = await db.User.findAll({
                attributes: [
                    'role',
                    [db.sequelize.fn('COUNT', db.sequelize.col('role')), 'count']
                ],
                group: ['role'],
                raw: true
            });

            // Tính tổng để có thể tính phần trăm
            const total = stats.reduce((sum, item) => sum + parseInt(item.count), 0);

            // Format dữ liệu để phù hợp với PieChart
            const formattedData = stats.map(item => {
                // Map role tiếng Việt sang tên hiển thị
                let displayName = item.role;
                if (item.role === 'Quản trị viên') displayName = 'Admin';
                else if (item.role === 'Tài xế') displayName = 'Tài xế';
                else if (item.role === 'Phụ huynh') displayName = 'Phụ huynh';

                return {
                    name: displayName,
                    value: parseInt(item.count),
                    percentage: ((parseInt(item.count) / total) * 100).toFixed(1)
                };
            });

            resolve({
                errCode: 0,
                message: "Lấy thống kê người dùng theo role thành công",
                data: formattedData,
                total: total
            });
        } catch (e) {
            console.error("❌ Lỗi khi thống kê role:", e);
            reject(e);
        }
    });
};

// Lấy tổng số trạm xe buýt
const getTotalBusStops = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await db.busStop.count();
            resolve({
                errCode: 0,
                message: "Lấy tổng số trạm thành công",
                total: count
            });
        } catch (e) {
            console.error("❌ Lỗi khi đếm trạm xe buýt:", e);
            reject(e);
        }
    });
};

// Lấy tổng số tuyến đường
const getTotalRoutes = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await db.Route.count();
            resolve({
                errCode: 0,
                message: "Lấy tổng số tuyến đường thành công",
                total: count
            });
        } catch (e) {
            console.error("❌ Lỗi khi đếm tuyến đường:", e);
            reject(e);
        }
    });
};

// Lấy thống kê học sinh theo tháng trong năm
const getStudentsByMonth = async (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const selectedYear = year || new Date().getFullYear();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
            
            // Lấy dữ liệu học sinh được tạo trong năm đã chọn
            const students = await db.Student.findAll({
                attributes: [
                    [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('id_student')), 'count']
                ],
                where: db.sequelize.where(
                    db.sequelize.fn('YEAR', db.sequelize.col('createdAt')),
                    selectedYear
                ),
                group: [db.sequelize.fn('MONTH', db.sequelize.col('createdAt'))],
                raw: true,
                order: [[db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'ASC']]
            });

            // Xác định số tháng cần hiển thị
            // Nếu là năm hiện tại thì chỉ hiển thị đến tháng hiện tại
            // Nếu là năm quá khứ thì hiển thị đủ 12 tháng
            const maxMonth = (selectedYear === currentYear) ? currentMonth : 12;

            // Tạo mảng với số tháng phù hợp
            const monthlyData = Array.from({ length: maxMonth }, (_, i) => ({
                month: i + 1,
                count: 0
            }));

            // Cập nhật số liệu thực tế
            students.forEach(item => {
                const monthIndex = parseInt(item.month) - 1;
                if (monthIndex < maxMonth) {
                    monthlyData[monthIndex].count = parseInt(item.count);
                }
            });

            // Tính tổng tích lũy theo tháng
            let cumulativeCount = 0;
            const cumulativeData = monthlyData.map(item => {
                cumulativeCount += item.count;
                return {
                    month: item.month,
                    students: cumulativeCount
                };
            });

            resolve({
                errCode: 0,
                message: "Lấy thống kê học sinh theo tháng thành công",
                year: selectedYear,
                maxMonth: maxMonth,
                data: cumulativeData
            });
        } catch (e) {
            console.error("❌ Lỗi khi thống kê học sinh theo tháng:", e);
            reject(e);
        }
    });
};

// Lấy danh sách các năm có dữ liệu học sinh
const getAvailableYears = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const years = await db.Student.findAll({
                attributes: [
                    [db.sequelize.fn('DISTINCT', db.sequelize.fn('YEAR', db.sequelize.col('createdAt'))), 'year']
                ],
                raw: true,
                order: [[db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'DESC']]
            });

            const yearList = years.map(item => parseInt(item.year));
            
            resolve({
                errCode: 0,
                message: "Lấy danh sách năm thành công",
                years: yearList
            });
        } catch (e) {
            console.error("❌ Lỗi khi lấy danh sách năm:", e);
            reject(e);
        }
    });
};

// Lấy thống kê học sinh theo tuyến đường
const getStudentsByRoute = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Query để đếm số học sinh theo từng tuyến
            const routeStats = await db.sequelize.query(`
                SELECT 
                    r.id_route,
                    r.name_street,
                    COUNT(DISTINCT s.id_student) as student_count
                FROM route r
                LEFT JOIN route_busstop rb ON r.id_route = rb.id_route
                LEFT JOIN student s ON rb.id_busstop = s.id_busstop
                GROUP BY r.id_route, r.name_street
                ORDER BY student_count DESC
            `, {
                type: db.sequelize.QueryTypes.SELECT
            });

            // Format dữ liệu
            const formattedData = routeStats.map(item => ({
                id_route: item.id_route,
                name_street: item.name_street,
                student_count: parseInt(item.student_count) || 0
            }));

            // Lấy top 5
            const top5 = formattedData.slice(0, 5);

            resolve({
                errCode: 0,
                message: "Lấy thống kê học sinh theo tuyến thành công",
                allRoutes: formattedData,
                top5Routes: top5
            });
        } catch (e) {
            console.error("❌ Lỗi khi thống kê học sinh theo tuyến:", e);
            reject(e);
        }
    });
};

// Lấy tất cả thống kê dashboard một lần
const getAllDashboardStats = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const [
                studentsResult, 
                usersResult, 
                roleStatsResult,
                busStopsResult,
                routesResult
            ] = await Promise.all([
                getTotalStudents(),
                getTotalUsers(),
                getUserStatsByRole(),
                getTotalBusStops(),
                getTotalRoutes()
            ]);

            resolve({
                errCode: 0,
                message: "Lấy tất cả thống kê thành công",
                data: {
                    totalStudents: studentsResult.total,
                    totalUsers: usersResult.total,
                    totalBusStops: busStopsResult.total,
                    totalRoutes: routesResult.total,
                    userRoleStats: roleStatsResult.data,
                    userRoleTotal: roleStatsResult.total
                }
            });
        } catch (e) {
            console.error("❌ Lỗi khi lấy thống kê dashboard:", e);
            reject(e);
        }
    });
};

module.exports = {
  getTotalStudents,
    getTotalUsers,
    getUserStatsByRole,
    getTotalBusStops,
    getTotalRoutes,
    getStudentsByMonth,
    getAvailableYears,
    getStudentsByRoute,
    getAllDashboardStats
};