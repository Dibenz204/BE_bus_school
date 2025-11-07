'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bus extends Model {
        static associate(models) {
            Bus.belongsTo(models.Driver, {
                foreignKey: 'id_driver',
                as: 'driver'
            });

            Bus.belongsTo(models.Route, {
                foreignKey: 'id_route',
                as: 'route'
            });

            Bus.hasMany(models.Schedule, {
                foreignKey: 'id_bus',
                as: 'schedules'
            })

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
        id_driver: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'driver',
                key: 'id_driver'
            }
        },
        id_route: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {  // ✅ Nên thêm references
                model: 'route',
                key: 'id_route'
            }
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
