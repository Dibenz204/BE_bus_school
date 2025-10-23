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
            unique: true,
            allowNull: false
        },
        birthday: {
            type: DataTypes.DATEONLY,
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
        password: {
            type: DataTypes.STRING,
            allowNull: true
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

        if (!user.password && user.birthday) {
            const date = new Date(user.birthday);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            user.password = `${day}${month}${year}`;
        }
    });

    return User;
};

