'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('schedule_student', {
            id_schedule: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'schedule',
                    key: 'id_schedule'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            id_student: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'student',
                    key: 'id_student'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            status: {
                type: Sequelize.ENUM('Đang chờ', 'Có mặt', 'Đã đưa/đón'),
                defaultValue: 'Đang chờ'
            },
        });
        await queryInterface.addConstraint('schedule_student', {
            fields: ['id_schedule', 'id_student'],
            type: 'primary key',
            name: 'pk_schedule_student'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('schedule_student');
    }
};
