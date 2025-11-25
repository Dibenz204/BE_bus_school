const db = require('../models/index.js');

// Lấy tất cả students hoặc 1 student theo id
const getAllStudent = (studentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let students = [];
            if (studentId === 'ALL') {
                students = await db.Student.findAll({
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email', 'phone']
                        },
                        {
                            model: db.busStop,
                            as: 'busstop',
                            attributes: ['id_busstop', 'name_station']
                        }
                    ],
                    raw: false,
                    nest: true
                });
            } else if (studentId && studentId !== 'ALL') {
                const student = await db.Student.findOne({
                    where: { id_student: studentId },
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id_user', 'name', 'email', 'phone']
                        },
                        {
                            model: db.busStop,
                            as: 'busstop',
                            attributes: ['id_busstop', 'name_station']
                        }
                    ],
                    raw: false,
                    nest: true
                });
                students = student ? [student] : [];
            }
            resolve(students);
        } catch (e) {
            reject(e);
        }
    });
};

// Tạo student mới
const createNewStudent = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Student.create({
                name: data.name,
                class: data.class,
                gender: data.gender,
                address_route: data.address_route,
                mssv: data.mssv,
                id_user: data.id_user,
                id_busstop: data.id_busstop
            });

            resolve({
                errCode: 0,
                message: 'Tạo học sinh thành công!'
            });

        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                resolve({
                    errCode: 2,
                    message: 'MSSV đã tồn tại!'
                });
            } else {
                reject(e);
            }
        }
    });
};

// Xóa student
const deleteStudent = (studentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await db.Student.findOne({
                where: { id_student: studentId },
                raw: false,
            });

            if (!student) {
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy học sinh!',
                });
            } else {
                await student.destroy();
                resolve({
                    errCode: 0,
                    message: 'Xóa học sinh thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy thông tin student theo id
const getStudentInfoById = (studentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await db.Student.findOne({
                where: { id_student: studentId },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id_user', 'name', 'email', 'phone']
                    },
                    {
                        model: db.busStop,
                        as: 'busstop',
                        attributes: ['id_busstop', 'name_station']
                    }
                ],
                raw: false,
                nest: true
            });

            if (!student) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy học sinh!",
                    student: {},
                });
            } else {
                resolve({
                    errCode: 0,
                    message: "Lấy thông tin học sinh thành công!",
                    student: student,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật student
const updateStudent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await db.Student.findOne({
                where: { id_student: data.id_student },
                raw: false,
            });

            if (!student) {
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy học sinh để cập nhật!",
                });
            } else {
                student.name = data.name;
                student.class = data.class;
                student.gender = data.gender;
                student.address_route = data.address_route;
                student.mssv = data.mssv;
                student.id_user = data.id_user;
                student.id_busstop = data.id_busstop;

                await student.save();

                resolve({
                    errCode: 0,
                    message: "Cập nhật thông tin học sinh thành công!",
                });
            }
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                resolve({
                    errCode: 2,
                    message: 'MSSV đã tồn tại!'
                });
            } else {
                reject(e);
            }
        }
    });
};

const getStudentsByParent = (parentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!parentId) {
                resolve({
                    errCode: 1,
                    message: "Thiếu id phụ huynh!"
                });
                return;
            }

            const students = await db.Student.findAll({
                where: { id_user: parentId },
                include: [
                    {
                        model: db.busStop,
                        as: 'busstop',
                        attributes: ['id_busstop', 'name_station']
                    }
                ],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                message: "Lấy danh sách học sinh thành công",
                students: students
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllStudent,
    createNewStudent,
    deleteStudent,
    getStudentInfoById,
    updateStudent,
    getStudentsByParent
};