'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('parent', {
            id_parent: {
                allowNull: false,
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('parent');
    }
};
