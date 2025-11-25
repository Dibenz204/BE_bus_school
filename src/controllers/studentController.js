const studentService = require('../services/studentService.js');

// Lấy tất cả students hoặc theo id
const handleGetAllStudent = async (req, res) => {
    try {
        let id = req.query.id_student || 'ALL';
        let students = await studentService.getAllStudent(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "Lấy dữ liệu thành công",
            students
        });
    } catch (error) {
        console.error("Lỗi khi lấy students:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy students"
        });
    }
};

// Tạo student mới
const postCreateNewStudent = async (req, res) => {
    try {
        const message = await studentService.createNewStudent(req.body);
        console.log(message);
        return res.status(200).json(message);
    } catch (e) {
        console.error("Lỗi khi tạo student mới:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo student mới"
        });
    }
};

// Xóa student
const handleDeleteStudent = async (req, res) => {
    try {
        const studentId = req.query.id_student;

        if (!studentId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id học sinh!",
            });
        }

        const result = await studentService.deleteStudent(studentId);
        console.log(result);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xóa học sinh!",
        });
    }
};

// Lấy thông tin student theo id
const handleGetStudentById = async (req, res) => {
    try {
        const studentId = req.query.id_student;

        if (!studentId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id học sinh!",
            });
        }

        const result = await studentService.getStudentInfoById(studentId);
        return res.status(200).json(result);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi lấy thông tin học sinh!",
        });
    }
};

// Cập nhật student
const handleUpdateStudent = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_student) {
            return res.status(400).json({
                errCode: 1,
                message: "Lỗi khi cập nhật học sinh!",
            });
        }

        const result = await studentService.updateStudent(data);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi cập nhật student:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi cập nhật học sinh!",
        });
    }
};

const handleGetStudentsByParent = async (req, res) => {
    try {
        const parentId = req.query.id_user;

        const result = await studentService.getStudentsByParent(parentId);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi khi lấy học sinh theo phụ huynh:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi lấy học sinh"
        });
    }
};


module.exports = {
    handleGetAllStudent,
    postCreateNewStudent,
    handleDeleteStudent,
    handleGetStudentById,
    handleUpdateStudent,
    handleGetStudentsByParent
};