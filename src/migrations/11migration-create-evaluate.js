'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('evaluate', {
            id_evaluate: {
                type: Sequelize.STRING(10),
                primaryKey: true
            },
            id_user: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id_user'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            id_schedule: {
                type: Sequelize.STRING(10),
                allowNull: true,
                references: {
                    model: 'schedule',
                    key: 'id_schedule'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            star: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('evaluate');
    }
};
