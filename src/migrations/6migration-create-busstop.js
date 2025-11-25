'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('busstop', {
            id_busstop: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            name_station: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            toado_x: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            toado_y: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            describe: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            visible: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            // ✅ timestamps
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
        await queryInterface.dropTable('busstop');
    }
};
