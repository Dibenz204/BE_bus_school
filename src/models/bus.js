'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bus extends Model {
        static associate(models) {
            // Nhiều bus thuộc 1 tài xế
            Bus.belongsTo(models.Driver, {
                foreignKey: 'id_driver',
                as: 'driver'
            });
        }
    }

    Bus.init({
        id_bus: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        bien_so: {
            type: DataTypes.STRING,
            allowNull: false
        },
        suc_chua: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_driver: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Bus',
        tableName: 'bus',
        timestamps: false
    });

    Bus.beforeCreate(async (bus, options) => {
        const lastBus = await Bus.findOne({
            order: [['id_bus', 'DESC']],
            attributes: ['id_bus'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastBus && lastBus.id_bus) {
            const currentNumber = parseInt(lastBus.id_bus.replace('MX', ''));
            nextNumber = currentNumber + 1;
        }

        bus.id_bus = `MX${nextNumber.toString().padStart(2, '0')}`;
    });

    return Bus;
};
