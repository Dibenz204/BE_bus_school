


'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Driver extends Model {
        static associate(models) {
            Driver.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'user'
            });

            // Một tài xế có thể lái nhiều xe bus
            Driver.hasMany(models.Bus, {
                foreignKey: 'id_driver',
                as: 'buses'
            });
        }
    }

    Driver.init({
        id_driver: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        giayphep: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Driver',
        tableName: 'driver',
        timestamps: false
    });

    Driver.beforeCreate(async (driver, options) => {
        const lastDriver = await Driver.findOne({
            order: [['id_driver', 'DESC']],
            attributes: ['id_driver'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastDriver && lastDriver.id_driver) {
            const currentNumber = parseInt(lastDriver.id_driver.replace('DV', ''));
            nextNumber = currentNumber + 1;
        }

        driver.id_driver = `DV${nextNumber.toString().padStart(2, '0')}`;
    });

    return Driver;
};
