const db = require('../models/index.js');

// Hàm sinh id_student mới dạng HS001, HS002, ...
async function generateStudentId() {
    const students = await db.Student.findAll({
        attributes: ['id_student'],
        paranoid: false
    });
    const usedIds = students.map(s => s.id_student);

    let i = 1;
    while (usedIds.includes(`HS${i.toString().padStart(3, '0')}`)) {
        i++;
    }
    return `HS${i.toString().padStart(3, '0')}`;
}

const createNewStudent = async (data) => {
    const user = await db.User.findOne({ where: { phone: data.phone } });
    if (!user) {
        throw new Error('Số điện thoại không tồn tại trong hệ thống!');
    }

    const id_student = await generateStudentId();

    await db.Student.create({
        id_student: id_student,
        name: data.name,
        class: data.class,
        gender: data.gender,
        address_route: data.address_route,
        id_user: user.id_user
    });

    return 'Create new student succeed!';
};

// Lấy danh sách tất cả học sinh kèm thông tin phụ huynh
const getAllStudents = async () => {
    const students = await db.Student.findAll({
        include: [{
            model: db.User,
            attributes: ['phone'],
            as: 'user'
        }],
        raw: false
    });

    // Format lại dữ liệu để gửi về client
    return students.map(student => ({
        id_student: student.id_student,
        name: student.name,
        class: student.class,
        gender: student.gender,
        address_route: student.address_route,
        phone: student.user ? student.user.phone : 'N/A'
    }));
};

// Xoá học sinh
const deleteStudent = async (id_student) => {
    const student = await db.Student.findByPk(id_student);
    if (!student) {
        throw new Error('Học sinh không tồn tại!');
    }

    await db.Student.destroy({
        where: { id_student: id_student }
    });

    return 'Delete student succeed!';
};

// Cập nhật thông tin học sinh
const updateStudent = async (id_student, data) => {
    const student = await db.Student.findByPk(id_student);
    if (!student) {
        throw new Error('Học sinh không tồn tại!');
    }

    // Nếu thay đổi số điện thoại, kiểm tra xem có user mới không
    if (data.phone && data.phone !== '') {
        const user = await db.User.findOne({ where: { phone: data.phone } });
        if (!user) {
            throw new Error('Số điện thoại không tồn tại trong hệ thống!');
        }
        data.id_user = user.id_user;
    }

    await db.Student.update(data, {
        where: { id_student: id_student }
    });

    return 'Update student succeed!';
};

module.exports = {
    createNewStudent,
    getAllStudents,
    deleteStudent,
    updateStudent
};