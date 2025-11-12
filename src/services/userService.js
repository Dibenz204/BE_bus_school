
const { raw } = require('body-parser');
const db = require('../models/index.js');
const { get } = require('../routes/userRoutes.js');


// const getAllUser = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let users = '';
//             if (userId === 'ALL') {
//                 users = await db.User.findAll({
//                     raw: true, // dùng để định dạng cho đẹp
//                     attributes: {   //truy cập thuộc tính
//                         exclude: ['password']   //ẩn đi password
//                     }
//                 })
//             }
//             if (userId && userId !== 'ALL') {
//                 users = await db.User.findOne({
//                     where: { id_user: userId },
//                     raw: true,
//                     attributes: {
//                         exclude: ['password']
//                     }
//                 })
//             }
//             resolve(users)
//         }
//         catch (e) {
//             reject(e);
//         }
//     })
// }


//Lấy hết tất cả user hoặc lấy 1 user theo id
const getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = [];
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    raw: true,
                    attributes: { exclude: ['password'] }
                });
            } else if (userId && userId !== 'ALL') {
                const user = await db.User.findOne({
                    where: { id_user: userId },
                    raw: true,
                    attributes: { exclude: ['password'] }
                });
                users = user ? [user] : []; // ép thành mảng
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

// Thống kê số lượng user theo vai trò
const userCountByRole = async () => {
    try {
        const counts = await db.User.findAll({
            attributes: ['role', [db.Sequelize.fn('COUNT', db.Sequelize.col('role')), 'count']],
            group: ['role'],
            raw: true
        });
        return counts;
    }
    catch (e) {
        throw e;
    }
}

// Lấy người dùng theo vai trò  
const userByRole = async (inputRole) => {
    try {
        const users = await db.User.findAll({
            where: { role: inputRole }
        });
        return users;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}


const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.create({
                // id_user: data.id_user,
                name: data.name,
                email: data.email,
                phone: data.phone,
                birthday: data.birthday,
                gender: data.gender,
                address: data.address,
                // password: data.password,
                role: data.role
            });

            resolve({
                errCode: 0,
                message: 'Tạo người dùng thành công!'
            })

        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id_user: userId },
                raw: false,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy người dùng!',
                });
            } else {
                await user.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa người dùng thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id_user: userId },
                raw: true,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!",
                    user: {},
                });
            } else {
                resolve({
                    errCode: 0,
                    message: "Lấy thông tin người dùng thành công!",
                    user: user,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id_user: data.id_user }, // đặt lại đúng trường khóa
                raw: false, // cần raw: false để có thể .save()
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng để cập nhật!",
                });
            } else {
                // Cập nhật dữ liệu
                user.name = data.name;
                user.phone = data.phone;
                user.password = data.password;
                user.email = data.email;
                user.address = data.address;
                user.gender = data.gender;
                user.birthday = data.birthday;

                await user.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật thông tin người dùng thành công!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// const handleLogin = async (email, password) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Kiểm tra email có tồn tại không
//             const user = await db.User.findOne({
//                 where: { email: email },
//                 raw: true,
//             });

//             if (!user) {
//                 resolve({
//                     errCode: 1,
//                     message: "Email không tồn tại trong hệ thống!",
//                 });
//                 return;
//             }

//             // Kiểm tra mật khẩu
//             if (user.password !== password) {
//                 resolve({
//                     errCode: 2,
//                     message: "Mật khẩu không chính xác!",
//                 });
//                 return;
//             }

//             // Đăng nhập thành công
//             resolve({
//                 errCode: 0,
//                 message: "Đăng nhập thành công!",
//                 user: {
//                     id_user: user.id_user,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     phone: user.phone,
//                     address: user.address,
//                 }
//             });

//         } catch (e) {
//             reject(e);
//         }
//     });
// };

const handleLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra email có tồn tại không
            const user = await db.User.findOne({
                where: { email: email },
                attributes: ['id_user', 'name', 'email', 'role', 'phone', 'address', 'password'],
                include: [
                    {
                        model: db.Driver,
                        as: 'drivers',
                        attributes: ['id_driver', 'toado_x', 'toado_y'],
                        required: false
                    }
                ]
            });

            // console.log("🔍 USER TÌM THẤY:", JSON.stringify(user, null, 2));
            // console.log("🔍 DRIVERS ARRAY:", user?.drivers); // ⭐ Sửa thành drivers

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Email không tồn tại trong hệ thống!",
                });
                return;
            }

            // Kiểm tra mật khẩu
            if (user.password !== password) {
                resolve({
                    errCode: 2,
                    message: "Mật khẩu không chính xác!",
                });
                return;
            }

            // Chuẩn bị response data
            const responseData = {
                id_user: user.id_user,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
            };

            // Nếu là tài xế, thêm id_driver vào response
            if (user.role === "Tài xế" && user.drivers && user.drivers.length > 0) {
                const driver = user.drivers[0];  // ⭐ Lấy phần tử đầu tiên trong array
                responseData.id_driver = driver.id_driver;
                responseData.toado_x = driver.toado_x;
                responseData.toado_y = driver.toado_y;
                // console.log("✅ ĐÃ THÊM ID_DRIVER:", driver.id_driver); // ⭐ SỬA DÒNG NÀY
            } else {
                console.log("❌ KHÔNG THÊM ID_DRIVER - Lý do:");
                console.log("- Role là Tài xế?", user.role === "Tài xế");
                console.log("- Có drivers?", !!user.drivers); // ⭐ SỬA DÒNG NÀY
                console.log("- Số lượng drivers:", user.drivers?.length || 0); // ⭐ THÊM DÒNG NÀY
            }

            // console.log("📤 DATA SẼ GỬI VỀ:", responseData);

            // Đăng nhập thành công
            resolve({
                errCode: 0,
                message: "Đăng nhập thành công!",
                user: responseData
            });

        } catch (e) {
            console.error("❌ Lỗi trong handleLogin:", e);
            reject(e);
        }
    });
};

module.exports = { getAllUser, userCountByRole, userByRole, createNewUser, deleteUser, getUserInfoById, updateUser, handleLogin };