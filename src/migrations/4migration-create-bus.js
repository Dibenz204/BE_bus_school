'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bus', {
            id_bus: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            bien_so: {
                type: Sequelize.STRING,
                allowNull: false
            },
            suc_chua: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_driver: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'driver',        // liên kết tới bảng driver
                    key: 'id_driver'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }

            // ✅ timestamps
            // createdAt: {
            //     allowNull: false,
            //     type: Sequelize.DATE,
            //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            // },
            // updatedAt: {
            //     allowNull: false,
            //     type: Sequelize.DATE,
            //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            // }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bus');
    }
};
