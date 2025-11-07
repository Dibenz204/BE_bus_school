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
            mssv: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
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
            },
            id_busstop: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'busstop',
                    key: 'id_busstop'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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
        await queryInterface.addIndex('student', ['mssv']);
    },


    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('student');
    }
};
