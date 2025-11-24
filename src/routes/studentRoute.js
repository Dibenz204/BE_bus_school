const express = require('express');
const studentController = require('../controllers/studentController.js');

const router = express.Router();

// Lấy tất cả students hoặc student theo id
router.get('/read_student', studentController.handleGetAllStudent);

// Lấy thông tin student theo id (chi tiết)
router.get('/get-student-by-id', studentController.handleGetStudentById);

// Tạo student mới
router.post('/create-new-student', studentController.postCreateNewStudent);

// Xóa student
router.delete('/delete-student', studentController.handleDeleteStudent);

// Cập nhật student
router.put("/update-student", studentController.handleUpdateStudent);

module.exports = router;