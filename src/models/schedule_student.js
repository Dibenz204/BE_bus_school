'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ScheduleStudent extends Model {
        static associate(models) {
            ScheduleStudent.belongsTo(models.Schedule, {
                foreignKey: 'id_schedule',
                as: 'schedule'
            });

            ScheduleStudent.belongsTo(models.Student, {
                foreignKey: 'id_student',
                as: 'student'
            });
        }
    }

    ScheduleStudent.init({
        id_schedule: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'schedule',
                key: 'id_schedule'
            }
        },
        id_student: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'student',
                key: 'id_student'
            }
        },
        status: {
            type: DataTypes.ENUM('Đang chờ', 'Có mặt', 'Đã đưa/đón'),
            defaultValue: 'Đang chờ'
        },
    }, {
        sequelize,
        modelName: 'ScheduleStudent',
        tableName: 'schedule_student',
        timestamps: false,
        id: false
    });

    return ScheduleStudent;
};