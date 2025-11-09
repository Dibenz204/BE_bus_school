'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('schedule', {
            id_schedule: {
                type: Sequelize.STRING(10),
                primaryKey: true
            },
            // id_bus: {
            //     type: Sequelize.STRING(10),
            //     allowNull: false,
            //     references: {
            //         model: 'bus',
            //         key: 'id_bus'
            //     },
            //     onUpdate: 'CASCADE',
            //     onDelete: 'CASCADE'
            // },
            id_route: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'route',
                    key: 'id_route'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            id_driver: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'driver',
                    key: 'id_driver'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            Stime: {
                type: Sequelize.TIME,
                allowNull: false
            },
            Sdate: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('Đã lên lịch', 'Vận hành', 'Hoàn thành', 'Hủy bỏ'),
                defaultValue: 'Đã lên lịch'
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('schedule');
    }
};
