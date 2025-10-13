'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('student', [
            {
                id_student: 'ST0001',
                name: 'Nguyễn Văn A',
                class: '10A1',
                gender: 'Nam',
                address_route: '123 Đường ABC, Quận 1, TP.HCM',
                id_user: 'U001',
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
