
const { raw } = require('body-parser');
const db = require('../models/index.js');
const { get } = require('../routes/userRoutes.js');


const getUserByPhone = (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { phone: phone },
                raw: true,
                attributes: { exclude: ['password'] }
            });

            resolve({
                errCode: 0,
                message: user ? "Tìm thấy người dùng" : "Không tìm thấy người dùng",
                users: user ? [user] : []
            });
        } catch (e) {
            reject(e);
        }
    });
};


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

// ⭐ Lưu OTP tạm thời (trong production nên dùng Redis)
const otpStorage = new Map();
const failedAttempts = new Map();

// ⭐ Tạo mã OTP 6 số
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ⭐ Gửi OTP qua email (cho quên mật khẩu)
const sendPasswordResetOTP = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: email },
                raw: true,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Email không tồn tại trong hệ thống!",
                });
                return;
            }

            const otp = generateOTP();
            const expiryTime = Date.now() + 60000;

            otpStorage.set(email, { otp, expiryTime });

            console.log(`📧 Đang gửi OTP: ${otp} đến email: ${email}`);

            await sendOTPEmail(email, otp);

            setTimeout(() => {
                otpStorage.delete(email);
                console.log(`🗑️ Đã xóa OTP hết hạn cho email: ${email}`);
            }, 60000);

            resolve({
                errCode: 0,
                message: "Mã OTP đã được gửi đến email của bạn!",
            });

        } catch (e) {
            console.error('❌ Lỗi trong sendPasswordResetOTP:', e);
            reject(e);
        }
    });
};

// ⭐ Xác thực OTP
const verifyOTP = async (email, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const storedData = otpStorage.get(email);

            if (!storedData) {
                resolve({
                    errCode: 1,
                    message: "Mã OTP không tồn tại hoặc đã hết hạn!",
                });
                return;
            }

            // Kiểm tra OTP đã hết hạn chưa
            if (Date.now() > storedData.expiryTime) {
                otpStorage.delete(email);
                resolve({
                    errCode: 2,
                    message: "Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại.",
                });
                return;
            }

            // Kiểm tra OTP đúng không
            if (storedData.otp !== otp) {
                resolve({
                    errCode: 3,
                    message: "Mã OTP không chính xác!",
                });
                return;
            }

            // OTP đúng
            console.log(`✅ Xác thực OTP thành công cho email: ${email}`);
            resolve({
                errCode: 0,
                message: "Xác thực OTP thành công!",
            });

        } catch (e) {
            reject(e);
        }
    });
};


// ⭐ Đổi mật khẩu (quên mật khẩu - không cần mật khẩu cũ)
const resetPassword = async (email, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: email },
                raw: false,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!",
                });
                return;
            }

            user.password = newPassword;
            await user.save();

            otpStorage.delete(email);

            // ⭐ Gửi email thông báo
            try {
                await sendPasswordChangedNotification(email, user.name);
            } catch (emailError) {
                console.error('⚠️ Lỗi gửi email thông báo:', emailError);
                // Không fail toàn bộ request nếu email không gửi được
            }

            console.log(`✅ Reset mật khẩu thành công cho email: ${email}`);
            resolve({
                errCode: 0,
                message: "Đổi mật khẩu thành công!",
            });

        } catch (e) {
            reject(e);
        }
    });
};
// ⭐ Đổi mật khẩu (đã đăng nhập - cần mật khẩu cũ)
const changePasswordWithOldPassword = async (email, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: email },
                raw: false,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!",
                });
                return;
            }

            // Kiểm tra lại mật khẩu cũ một lần nữa để đảm bảo an toàn
            if (user.password !== oldPassword) {
                resolve({
                    errCode: 2,
                    message: "Mật khẩu cũ không chính xác!",
                });
                return;
            }

            // Cập nhật mật khẩu mới
            user.password = newPassword;
            await user.save();

            // Xóa failed attempts sau khi đổi mật khẩu thành công
            failedAttempts.delete(email);

            // ⭐ Gửi email thông báo
            try {
                await sendPasswordChangedNotification(email, user.name);
            } catch (emailError) {
                console.error('⚠️ Lỗi gửi email thông báo:', emailError);
            }

            console.log(`✅ Đổi mật khẩu thành công cho email: ${email}`);
            resolve({
                errCode: 0,
                message: "Đổi mật khẩu thành công!",
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ⭐ Đổi mật khẩu
const changePassword = async (email, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: email },
                raw: false,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!",
                });
                return;
            }

            // Cập nhật mật khẩu mới
            user.password = newPassword;
            await user.save();

            // Xóa OTP sau khi đổi mật khẩu thành công
            otpStorage.delete(email);

            console.log(`✅ Đổi mật khẩu thành công cho email: ${email}`);
            resolve({
                errCode: 0,
                message: "Đổi mật khẩu thành công!",
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ⭐ Chỉ xác thực mật khẩu cũ (KHÔNG đổi mật khẩu)
const verifyOldPasswordOnly = async (email, oldPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem tài khoản có bị khóa không
            const attemptData = failedAttempts.get(email);
            if (attemptData && attemptData.lockedUntil > Date.now()) {
                const remainingTime = Math.ceil((attemptData.lockedUntil - Date.now()) / 1000);
                resolve({
                    errCode: 4,
                    message: `Tài khoản tạm khóa do nhập sai mật khẩu quá nhiều. Vui lòng thử lại sau ${remainingTime} giây.`,
                    remainingTime
                });
                return;
            }

            const user = await db.User.findOne({
                where: { email: email },
                raw: true,
            });

            if (!user) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy người dùng!",
                });
                return;
            }

            // Kiểm tra mật khẩu cũ
            if (user.password !== oldPassword) {
                // Tăng số lần nhập sai
                let currentAttempts = attemptData ? attemptData.count : 0;
                currentAttempts++;

                if (currentAttempts >= 5) {
                    // Khóa 5 phút
                    const lockedUntil = Date.now() + 5 * 60 * 1000;
                    failedAttempts.set(email, { count: currentAttempts, lockedUntil });

                    // Tự động mở khóa sau 5 phút
                    setTimeout(() => {
                        failedAttempts.delete(email);
                        console.log(`🔓 Đã mở khóa tài khoản: ${email}`);
                    }, 5 * 60 * 1000);

                    resolve({
                        errCode: 3,
                        message: "Bạn đã nhập sai mật khẩu 5 lần. Chức năng đổi mật khẩu đã bị khóa trong 5 phút!",
                        locked: true
                    });
                    return;
                } else {
                    failedAttempts.set(email, { count: currentAttempts, lockedUntil: 0 });
                    resolve({
                        errCode: 2,
                        message: `Mật khẩu cũ không chính xác! (Còn ${5 - currentAttempts} lần thử)`,
                        remainingAttempts: 5 - currentAttempts
                    });
                    return;
                }
            }

            // Mật khẩu đúng - reset failed attempts
            failedAttempts.delete(email);

            console.log(`✅ Xác thực mật khẩu cũ thành công cho email: ${email}`);
            resolve({
                errCode: 0,
                message: "Xác thực mật khẩu thành công!",
            });

        } catch (e) {
            reject(e);
        }
    });
};

// module.exports = { getAllUser, userCountByRole, userByRole, createNewUser, deleteUser, getUserInfoById, updateUser, handleLogin };

module.exports = {
    getAllUser, userCountByRole, userByRole,
    createNewUser, deleteUser, getUserInfoById, updateUser, getUserByPhone,
    handleLogin, sendPasswordResetOTP, verifyOTP, changePassword,
    resetPassword, changePasswordWithOldPassword, verifyOldPasswordOnly
};