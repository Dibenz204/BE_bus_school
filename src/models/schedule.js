'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            Schedule.belongsTo(models.Route, {
                foreignKey: 'id_route',
                as: 'routes'
            });

            Schedule.belongsTo(models.Driver, {
                foreignKey: 'id_driver',
                as: 'driver'
            });

            Schedule.belongsToMany(models.Student, {
                through: 'ScheduleStudent',
                foreignKey: 'id_schedule',
                otherKey: 'id_student',
                as: 'students'
            });

            Schedule.hasMany(models.Notification, {
                foreignKey: 'id_schedule',
                as: 'notifications'
            });

            Schedule.hasMany(models.Evaluate, {
                foreignKey: 'id_schedule',
                as: 'evaluates'
            });
        }
    }

    Schedule.init({
        id_schedule: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        // id_bus: {
        //     type: DataTypes.STRING(10),
        //     allowNull: false,
        //     references: {
        //         model: 'bus',
        //         key: 'id_bus'
        //     },
        // },
        id_route: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'route',
                key: 'id_route'
            },
        },
        id_driver: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'driver',
                key: 'id_driver'
            }
        },
        Stime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        Sdate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Đã lên lịch', 'Vận hành', 'Hoàn thành', 'Hủy bỏ'),
            defaultValue: 'Đã lên lịch'
        }
    }, {
        sequelize,
        modelName: 'Schedule',
        tableName: 'schedule',
        timestamps: false
    });

    Schedule.beforeCreate(async (schedule, options) => {
        const lastSchedule = await Schedule.findOne({
            order: [['id_schedule', 'DESC']],
            attributes: ['id_schedule'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastSchedule && lastSchedule.id_schedule) {
            const currentNumber = parseInt(lastSchedule.id_schedule.replace('SC', ''));
            nextNumber = currentNumber + 1;
        }

        schedule.id_schedule = `SC${nextNumber.toString().padStart(3, '0')}`;

    });

    return Schedule;
};