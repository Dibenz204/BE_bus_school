
const userService = require('../services/userService.js')

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng nhập đầy đủ email và mật khẩu!",
            });
        }

        // ⭐ GỌI SERVICE XỬ LÝ LOGIN
        const result = await userService.handleLogin(email, password);

        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi đăng nhập:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi đăng nhập!",
        });
    }
};

const getUserByPhone = async (req, res) => {
    try {
        const phone = req.query.phone;
        const result = await userService.getUserByPhone(phone);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi tìm user theo phone:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tìm user"
        });
    }
};


const handleGetAllUser = async (req, res) => {
    // let id = req.body.id_user;
    let id = req.query.id_user;

    let usser = await userService.getAllUser(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "oke",
        usser
    })
}

const getUserCountByRole = async (req, res) => {
    try {
        const data = await userService.userCountByRole();
        return res.status(200).json({
            errCode: 0,
            message: "Thống kê vai trò thành công",
            data
        });

    } catch (error) {
        console.error("Lỗi khi thống kê vai trò:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi thống kê vai trò"
        });
    }
};

const getUserByRole = async (req, res) => {
    try {
        const role = req.query.role;
        const users = await userService.userByRole(role);
        return res.status(200).json({
            errCode: 0,
            message: "Lọc theo role thành công",
            users
        });

    }
    catch (error) {
        console.error("Lỗi lọc theo role:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi lọc theo role"
        });
    }
}


const postCreateNewUser = async (req, res) => {
    try {
        const message = await userService.createNewUser(req.body);
        console.log(message);
        return res.status(200).json(message);
    }
    catch (e) {
        console.error("Lỗi khi tạo user mới:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi hệ thống khi tạo user mới"
        });
    }
}


const handleDeleteUser = async (req, res) => {
    try {
        const userId = req.query.id_user;

        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                message: "Không tìm thấy id người dùng!",
            });
        }

        const result = await userService.deleteUser(userId);
        console.log(result);
        return res.status(200).json(result);


    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xóa người dùng!",
        });
    }
};

const handleUpdateUser = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_user) {
            return res.status(400).json({
                errCode: 1,
                message: "Lỗi người dùng khi cập nhật!",
            });
        }

        const result = await userService.updateUser(data);
        return res.status(200).json(result);
    } catch (e) {
        console.error("❌ Lỗi khi cập nhật user:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi cập nhật người dùng!",
        });
    }
};

// Thêm vào userController.js
const getDriverLocationsForParent = async (req, res) => {
    try {
        const { id_parent } = req.query;

        if (!id_parent) {
            return res.status(400).json({
                errCode: 1,
                message: "Thiếu id phụ huynh!"
            });
        }

        const result = await userService.getActiveDriverLocationsForParent(id_parent);

        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Lỗi controller getDriverLocationsForParent:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server: " + error.message
        });
    }
};

const handleSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp email!",
            });
        }

        const result = await userService.sendPasswordResetOTP(email);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi gửi OTP:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi gửi OTP!",
        });
    }
};

// ⭐ Controller xác thực OTP
const handleVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp email và mã OTP!",
            });
        }

        const result = await userService.verifyOTP(email, otp);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi xác thực OTP:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xác thực OTP!",
        });
    }
};

// ⭐ Controller reset mật khẩu (quên mật khẩu)
const handleResetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp email và mật khẩu mới!",
            });
        }

        const result = await userService.resetPassword(email, newPassword);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi reset mật khẩu:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi reset mật khẩu!",
        });
    }
};

// ⭐ Controller đổi mật khẩu (đã đăng nhập)
const handleChangePasswordWithOld = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp đầy đủ thông tin!",
            });
        }

        const result = await userService.changePasswordWithOldPassword(email, oldPassword, newPassword);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi đổi mật khẩu:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi đổi mật khẩu!",
        });
    }
};

// ⭐ Controller đổi mật khẩu
const handleChangePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp email và mật khẩu mới!",
            });
        }

        const result = await userService.changePassword(email, newPassword);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi đổi mật khẩu:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi đổi mật khẩu!",
        });
    }
};

// ⭐ Controller xác thực mật khẩu cũ (không đổi mật khẩu)
const handleVerifyOldPassword = async (req, res) => {
    try {
        const { email, oldPassword } = req.body;

        if (!email || !oldPassword) {
            return res.status(400).json({
                errCode: 1,
                message: "Vui lòng cung cấp đầy đủ thông tin!",
            });
        }

        const result = await userService.verifyOldPasswordOnly(email, oldPassword);
        return res.status(200).json(result);

    } catch (e) {
        console.error("❌ Lỗi khi xác thực mật khẩu cũ:", e);
        return res.status(500).json({
            errCode: 1,
            message: "Lỗi server khi xác thực mật khẩu!",
        });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUser,
    getUserCountByRole,
    getUserByRole,
    postCreateNewUser,
    handleDeleteUser,
    handleUpdateUser,
    getDriverLocationsForParent,
    getUserByPhone,
    handleSendOTP,
    handleVerifyOTP,
    handleChangePassword,
    handleResetPassword,
    handleChangePasswordWithOld,
    handleVerifyOldPassword
} 
