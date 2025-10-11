'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Parent extends Model {
        static associate(models) {
            // Không cần associate lúc này
        }
    }

    Parent.init({
        id_parent: {
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
        modelName: 'Parent',
        tableName: 'parent',
        timestamps: false,
        underscored: false
    });

    // Tạo ID: PR001, PR002...
    Parent.beforeCreate(async (parent, options) => {
        const lastParent = await Parent.findOne({
            order: [['id_parent', 'DESC']],
            attributes: ['id_parent'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastParent && lastParent.id_parent) {
            const currentNumber = parseInt(lastParent.id_parent.replace('PR', ''));
            nextNumber = currentNumber + 1;
        }

        parent.id_parent = `PR${nextNumber.toString().padStart(3, '0')}`;
    });

    return Parent;
};

