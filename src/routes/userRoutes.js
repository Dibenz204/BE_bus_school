
const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/login', userController.handleLogin);

router.get('/read_user', userController.handleGetAllUser);

router.get('/user-count-by-role', userController.getUserCountByRole);

router.get('/users-by-role', userController.getUserByRole);

router.post('/create-new-user', userController.postCreateNewUser);

router.delete('/delete-user', userController.handleDeleteUser);

router.put("/update-user", userController.handleUpdateUser);

// Routes cho quên mật khẩu
router.post('/send-otp', userController.handleSendOTP);
router.post('/verify-otp', userController.handleVerifyOTP);
router.post('/reset-password', userController.handleResetPassword);

// Route cho đổi mật khẩu (đã đăng nhập)
router.post('/change-password-with-old', userController.handleChangePasswordWithOld);
// Route xác thực mật khẩu cũ (không đổi mật khẩu)
router.post('/verify-old-password', userController.handleVerifyOldPassword);

router.get('/get-user-by-phone', userController.getUserByPhone);

module.exports = router;