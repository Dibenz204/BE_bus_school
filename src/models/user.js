'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Student, {
                foreignKey: 'id_user',
                as: 'students'
            })

            User.hasMany(models.Driver, {
                foreignKey: 'id_user',
                as: 'drivers'
            })
        }
    }

    User.init({
        id_user: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('Quản trị viên', 'Phụ huynh', 'Tài xế'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: true,
        underscored: false
    });

    // Tạo ID: PR001, PR002...
    User.beforeCreate(async (user, options) => {
        const lastUser = await User.findOne({
            order: [['id_user', 'DESC']],
            attributes: ['id_user'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastUser && lastUser.id_user) {
            const currentNumber = parseInt(lastUser.id_user.replace('U', ''));
            nextNumber = currentNumber + 1;
        }

        user.id_user = `U${nextNumber.toString().padStart(3, '0')}`;
    });

    return User;
};

