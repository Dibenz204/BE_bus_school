'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Route extends Model {
        static associate(models) {
            Route.belongsToMany(models.busStop, {
                through: 'route_busstop',
                foreignKey: 'id_route',
                otherKey: 'id_busstop',
                as: 'busstops'
            });
        }
    }

    Route.init({
        id_route: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        name_street: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Route',
        tableName: 'route',
        timestamps: false
    });

    Route.beforeCreate(async (route, options) => {
        const lastRoute = await Route.findOne({
            order: [['id_route', 'DESC']],
            attributes: ['id_route'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastRoute && lastRoute.id_route) {
            const currentNumber = parseInt(lastRoute.id_route.replace('R', ''));
            nextNumber = currentNumber + 1;
        }

        route.id_route = `R${nextNumber.toString().padStart(2, '0')}`;
    });

    return Route;
};
