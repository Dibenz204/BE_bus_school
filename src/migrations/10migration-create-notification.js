'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification', {
            id_notification: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },

            id_schedule: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'schedule',
                    key: 'id_schedule'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            id_busstop: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'busstop',
                    key: 'id_busstop'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            id_driver: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'driver',
                    key: 'id_driver'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            id_user: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'user',
                    key: 'id_user'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            recipient_type: {
                type: Sequelize.ENUM('parent', 'admin', 'driver', 'all'),
                allowNull: false,
                defaultValue: 'parent'
            },

            notification_type: {
                type: Sequelize.ENUM('Trạm', 'Lịch trình', 'Sự cố', 'Khác'),
                allowNull: false,
                defaultValue: 'Lịch trình'
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        // Xóa ENUM trước khi drop table để tránh lỗi
        await queryInterface.dropTable('notification');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_recipient_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_notification_type";');
    }
};
