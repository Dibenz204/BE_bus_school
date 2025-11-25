// File: models/Notification.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.Schedule, {
                foreignKey: 'id_schedule',
                as: 'schedule'
            });

            Notification.belongsTo(models.busStop, {
                foreignKey: 'id_busstop',
                as: 'busstop'
            });

            Notification.belongsTo(models.Driver, {
                foreignKey: 'id_driver',
                as: 'driver'
            });

            // Thêm association với User nếu cần
            Notification.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'user'
            });
        }
    }

    Notification.init({
        id_notification: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        id_schedule: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        id_busstop: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        id_driver: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(10),
            allowNull: true, // NULL = gửi cho tất cả phụ huynh liên quan
            comment: 'User cụ thể nhận thông báo (nếu null = gửi cho all parents liên quan)'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        recipient_type: {
            type: DataTypes.ENUM('parent', 'admin', 'driver', 'all'),
            defaultValue: 'parent'
        },
        notification_type: {
            type: DataTypes.ENUM('bus_approaching', 'bus_arrived', 'bus_departed', 'schedule_update'),
            defaultValue: 'bus_approaching'
        }
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'notification',
        timestamps: true
    });

    Notification.beforeCreate(async (notification, options) => {
        const lastNotification = await Notification.findOne({
            order: [['id_notification', 'DESC']],
            attributes: ['id_notification'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastNotification && lastNotification.id_notification) {
            const currentNumber = parseInt(lastNotification.id_notification.replace('NF', ''));
            nextNumber = currentNumber + 1;
        }

        notification.id_notification = `NF${nextNumber.toString().padStart(4, '0')}`;
    });

    return Notification;
};