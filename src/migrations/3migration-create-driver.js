'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('driver', {
            id_driver: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true
            },
            giayphep: {
                type: Sequelize.STRING,
                allowNull: false
            },
            id_user: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'user',  // liên kết tới bảng user
                    key: 'id_user'
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
        await queryInterface.dropTable('driver');
    }
};
