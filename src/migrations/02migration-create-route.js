'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('route', {
            id_route: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            name_street: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('route');
    }
};
