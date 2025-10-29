'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('student', {
            id_student: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            class: {
                type: Sequelize.STRING,
                allowNull: false
            },
            gender: {
                type: Sequelize.ENUM('Nam', 'Nữ', 'Khác'),
                allowNull: false
            },
            address_route: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            id_user: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'user', // liên kết tới bảng user
                    key: 'id_user'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }

        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('student');
    }
};
