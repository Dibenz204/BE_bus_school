'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Parent', {
            id_parent: {
                allowNull: false,
                // autoIncrement: true,
                primaryKey: true,
                type: Sequelize.STRING(10)
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            gender: {
                type: Sequelize.ENUM('male', 'female', 'other'),
                allowNull: false,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                defaultValue: 'active'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Parent');
    }
};