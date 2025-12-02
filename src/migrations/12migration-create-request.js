'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('request', {
            id_request: {
                type: Sequelize.STRING(10),
                primaryKey: true
            },
            id_user: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'user',   // check đúng tên table trong DB
                    key: 'id_user'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            request_type: {
                type: Sequelize.ENUM('Xe bus', 'Trạm đón/trả', 'Tuyến đường', 'Khác'),
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('request');
    }
};
