

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

        // Gọi service xử lý login
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


module.exports = {
    handleLogin,
    handleGetAllUser,
    getUserCountByRole,
    getUserByRole,
    postCreateNewUser,
    handleDeleteUser,
    handleUpdateUser
} 
