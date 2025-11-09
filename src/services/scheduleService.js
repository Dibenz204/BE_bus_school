
const { get } = require('http');
const db = require('../models/index.js');

const getAllSchedules = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = [];
            if (scheduleId === 'ALL') {
                schedules = await db.Schedule.findAll({
                    include: [
                        {
                            model: db.Route,
                            as: 'routes',
                            attributes: ['id_route', 'name_street']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver', 'name']
                        },
                        {
                            model: db.Student,
                            as: 'students',
                            attributes: ['id_student', 'name', 'class'],
                            through: { attributes: ['status'] }
                        }
                    ],
                    order: [['Sdate', 'DESC'], ['Stime', 'ASC']]
                });
            } else if (scheduleId && scheduleId !== 'ALL') {
                const schedule = await db.Schedule.findOne({
                    where: { id_schedule: scheduleId },
                    include: [
                        {
                            model: db.Route,
                            as: 'routes',
                            attributes: ['id_route', 'name_street']
                        },
                        {
                            model: db.Driver,
                            as: 'driver',
                            attributes: ['id_driver', 'name']
                        },
                        {
                            model: db.Student,
                            as: 'students',
                            attributes: ['id_student', 'name', 'class', 'gender', 'id_busstop'],
                            through: { attributes: ['status'] }
                        }
                    ]
                });
                schedules = schedule ? [schedule] : [];
            }
            resolve(schedules);
        } catch (e) {
            reject(e);
        }
    });
};


const createNewSchedule = async (data) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            // 1. Tạo schedule mới
            const newSchedule = await db.Schedule.create({
                id_route: data.id_route,
                id_driver: data.id_driver,
                Stime: data.Stime,
                Sdate: data.Sdate,
                status: data.status || 'Đã lên lịch'
            }, { transaction });

            // 2. Lấy tất cả busstops thuộc route này
            const routeBusStops = await db.RouteBusStop.findAll({
                where: { id_route: data.id_route },
                attributes: ['id_busstop'],
                raw: true,
                transaction
            });

            const busStopIds = routeBusStops.map(item => item.id_busstop);

            // 3. Lấy tất cả students có id_busstop nằm trong danh sách busstops của route
            const students = await db.Student.findAll({
                where: {
                    id_busstop: busStopIds
                },
                attributes: ['id_student'],
                raw: true,
                transaction
            });

            // 4. Thêm students vào schedule_student
            if (students.length > 0) {
                const scheduleStudents = students.map(student => ({
                    id_schedule: newSchedule.id_schedule,
                    id_student: student.id_student,
                    status: 'Đang chờ'
                }));

                await db.ScheduleStudent.bulkCreate(scheduleStudents, { transaction });
            }

            await transaction.commit();

            resolve({
                errCode: 0,
                message: 'Tạo lịch trình thành công!',
                scheduleId: newSchedule.id_schedule,
                studentCount: students.length
            });

        } catch (e) {
            await transaction.rollback();
            reject(e);
        }
    });
};

const deleteSchedule = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            const schedule = await db.Schedule.findOne({
                where: { id_schedule: scheduleId },
                raw: false,
                transaction
            });

            if (!schedule) {
                await transaction.rollback();
                resolve({
                    errCode: 1,
                    message: 'Không tìm thấy lịch trình!',
                });
            } else {
                // Xóa tất cả records trong schedule_student trước
                await db.ScheduleStudent.destroy({
                    where: { id_schedule: scheduleId },
                    transaction
                });

                // Sau đó xóa schedule
                await schedule.destroy({ transaction });
                await transaction.commit();

                resolve({
                    errCode: 0,
                    message: 'Xóa lịch trình thành công!',
                });
            }
        } catch (e) {
            await transaction.rollback();
            reject(e);
        }
    });
};

const updateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            const schedule = await db.Schedule.findOne({
                where: { id_schedule: data.id_schedule },
                raw: false,
                transaction
            });

            if (!schedule) {
                await transaction.rollback();
                resolve({
                    errCode: 1,
                    message: "Không tìm thấy lịch trình để cập nhật!",
                });
            } else {
                // Cập nhật thông tin schedule
                schedule.id_route = data.id_route;
                schedule.id_driver = data.id_driver;
                schedule.Stime = data.Stime;
                schedule.Sdate = data.Sdate;
                schedule.status = data.status;

                await schedule.save({ transaction });

                // Nếu route thay đổi, cập nhật lại danh sách students
                if (data.id_route !== schedule._previousDataValues.id_route) {
                    // Xóa tất cả students hiện tại
                    await db.ScheduleStudent.destroy({
                        where: { id_schedule: data.id_schedule },
                        transaction
                    });

                    // Lấy busstops mới
                    const routeBusStops = await db.RouteBusStop.findAll({
                        where: { id_route: data.id_route },
                        attributes: ['id_busstop'],
                        raw: true,
                        transaction
                    });

                    const busStopIds = routeBusStops.map(item => item.id_busstop);

                    // Lấy students mới
                    const students = await db.Student.findAll({
                        where: {
                            id_busstop: busStopIds
                        },
                        attributes: ['id_student'],
                        raw: true,
                        transaction
                    });

                    // Thêm students mới
                    if (students.length > 0) {
                        const scheduleStudents = students.map(student => ({
                            id_schedule: data.id_schedule,
                            id_student: student.id_student,
                            status: 'Đang chờ'
                        }));

                        await db.ScheduleStudent.bulkCreate(scheduleStudents, { transaction });
                    }
                }

                await transaction.commit();

                resolve({
                    errCode: 0,
                    message: "Cập nhật lịch trình thành công!",
                });
            }
        } catch (e) {
            await transaction.rollback();
            reject(e);
        }
    });
};


// Cập nhật trạng thái pickup của student trong schedule
// const updateStudentPickupStatus = (scheduleId, studentId, status) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const scheduleStudent = await db.ScheduleStudent.findOne({
//                 where: {
//                     id_schedule: scheduleId,
//                     id_student: studentId
//                 },
//                 raw: false
//             });

//             if (!scheduleStudent) {
//                 resolve({
//                     errCode: 1,
//                     message: "Không tìm thấy học sinh trong lịch trình này!",
//                 });
//             } else {
//                 scheduleStudent.status = status;
//                 await scheduleStudent.save();

//                 resolve({
//                     errCode: 0,
//                     message: "Cập nhật trạng thái thành công!",
//                 });
//             }
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// // Lấy schedules theo driver
// const getSchedulesByDriver = (driverId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const schedules = await db.Schedule.findAll({
//                 where: { id_driver: driverId },
//                 include: [
//                     {
//                         model: db.Route,
//                         as: 'routes',
//                         attributes: ['id_route', 'name_street']
//                     },
//                     {
//                         model: db.Student,
//                         as: 'students',
//                         attributes: ['id_student', 'name', 'class', 'gender'],
//                         through: { attributes: ['status'] }
//                     }
//                 ],
//                 order: [['Sdate', 'DESC'], ['Stime', 'ASC']]
//             });

//             resolve(schedules);
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// // Lấy schedules theo route
// const getSchedulesByRoute = (routeId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const schedules = await db.Schedule.findAll({
//                 where: { id_route: routeId },
//                 include: [
//                     {
//                         model: db.Driver,
//                         as: 'driver',
//                         attributes: ['id_driver', 'name']
//                     },
//                     {
//                         model: db.Student,
//                         as: 'students',
//                         attributes: ['id_student', 'name', 'class'],
//                         through: { attributes: ['status'] }
//                     }
//                 ],
//                 order: [['Sdate', 'DESC'], ['Stime', 'ASC']]
//             });

//             resolve(schedules);
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// // Thống kê số lượng schedules theo status
// const scheduleCountByStatus = async () => {
//     try {
//         const counts = await db.Schedule.findAll({
//             attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
//             group: ['status'],
//             raw: true
//         });
//         return counts;
//     } catch (e) {
//         throw e;
//     }
// }

module.exports = {
    createNewSchedule,
    getAllSchedules,
    deleteSchedule,
    updateSchedule
}