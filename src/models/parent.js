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
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'Parent',
        tableName: 'parent',
        timestamps: true,
        underscored: false
    });

    // Tạo ID: PR001, PR002...
    Parent.beforeCreate(async (parent, options) => {
        const lastParent = await Parent.findOne({
            order: [['created_at', 'DESC']],
            attributes: ['id_parent'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastParent && lastParent.id) {
            const currentNumber = parseInt(lastParent.id.replace('PR', ''));
            nextNumber = currentNumber + 1;
        }

        id_parent = `PR${nextNumber.toString().padStart(3, '0')}`;
    });

    return Parent;
};

