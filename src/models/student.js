'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            Student.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'user'
            });
        }
    }

    Student.init({
        id_student: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        class: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
            allowNull: false
        },
        address_route: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_user: {                    // Khóa ngoại trỏ tới Parent
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id_user'
            }
        }
    }, {
        sequelize,
        modelName: 'Student',
        tableName: 'student',
        timestamps: false,
        underscored: false
    });

    // Tạo ID: PR001, PR002...
    Student.beforeCreate(async (student, options) => {
        const lastStudent = await Student.findOne({
            order: [['id_student', 'DESC']],
            attributes: ['id_student'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastStudent && lastStudent.id_student) {
            const currentNumber = parseInt(lastStudent.id_student.replace('HS', ''));
            nextNumber = currentNumber + 1;
        }

        student.id_student = `HS${nextNumber.toString().padStart(4, '0')}`;

        if (!student.address_route) {
            const User = sequelize.models.User;
            const usser = await User.findByPk(student.id_user, { transaction: options?.transaction });
            if (usser) {
                student.address_route = usser.address;
            }
        }
    });

    return Student;
};

