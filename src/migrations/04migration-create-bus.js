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
            id_driver: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'driver',
                    key: 'id_driver'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            id_route: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'route',
                    key: 'id_route'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            // ✅ THÊM TIMESTAMPS
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
        await queryInterface.dropTable('bus');
    }
};

// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//     async up(queryInterface, Sequelize) {
//         await queryInterface.createTable('bus', {
//             id_bus: {
//                 type: Sequelize.STRING(10),
//                 allowNull: false,
//                 primaryKey: true
//             },
//             bien_so: {
//                 type: Sequelize.STRING,
//                 allowNull: false
//             },
//             id_driver: {
//                 type: Sequelize.STRING(10),
//                 allowNull: false,
//                 references: {
//                     model: 'driver',
//                     key: 'id_driver'
//                 },
//                 onUpdate: 'CASCADE',
//                 onDelete: 'CASCADE'
//             },
//             id_route: {
//                 type: Sequelize.STRING(10),
//                 allowNull: false,
//                 references: {
//                     model: 'route',
//                     key: 'id_route'
//                 },
//                 onUpdate: 'CASCADE',
//                 onDelete: 'CASCADE'
//             }
//         });
//     },

//     async down(queryInterface, Sequelize) {
//         await queryInterface.dropTable('bus');
//     }
// };
