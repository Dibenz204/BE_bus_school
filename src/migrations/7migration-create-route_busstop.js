'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('route_busstop', {
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
            id_busstop: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references: {
                    model: 'busStop', // nên dùng chữ thường
                    key: 'id_busstop'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            stt_busstop: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });

        // Khóa chính kép
        await queryInterface.addConstraint('route_busstop', {
            fields: ['id_route', 'id_busstop'],
            type: 'primary key',
            name: 'pk_route_busstop'
        });

        // Optional: Đảm bảo thứ tự không trùng trong cùng tuyến
        await queryInterface.addConstraint('route_busstop', {
            fields: ['id_route', 'stt_busstop'],
            type: 'unique',
            name: 'uq_route_stt'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('route_busstop');
    }
};



// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//     async up(queryInterface, Sequelize) {
//         await queryInterface.createTable('route_busstop', {
//             id_route: {
//                 type: Sequelize.STRING(10),
//                 allowNull: false,
//                 references: {
//                     model: 'route',
//                     key: 'id_route'
//                 },
//                 onUpdate: 'CASCADE',
//                 onDelete: 'CASCADE'
//             },
//             id_busstop: {
//                 type: Sequelize.STRING(10),
//                 allowNull: false,
//                 references: {
//                     model: 'busStop',
//                     key: 'id_busstop'
//                 },
//                 onUpdate: 'CASCADE',
//                 onDelete: 'CASCADE'
//             },
//             stt_busstop: {
//                 type: Sequelize.INTEGER,
//                 allowNull: false
//             }
//         });

//         // Nếu muốn tránh trùng (1 route có cùng trạm 2 lần)
//         await queryInterface.addConstraint('route_busstop', {
//             fields: ['id_route', 'id_busstop'],
//             type: 'primary key',
//             name: 'pk_route_busstop'
//         });
//     },

//     async down(queryInterface, Sequelize) {
//         await queryInterface.dropTable('route_busstop');
//     }
// };
