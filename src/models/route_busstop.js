'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RouteBusStop extends Model {
        static associate(models) {
            RouteBusStop.belongsTo(models.busStop, {
                foreignKey: 'id_busstop',
                as: 'busStop'
            });

            RouteBusStop.belongsTo(models.Route, {
                foreignKey: 'id_route',
                as: 'route'
            });
        }
    }

    RouteBusStop.init({
        id_route: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,  //  Thêm dòng này
            references: {
                model: 'route',
                key: 'id_route'
            }
        },
        id_busstop: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,  //  Thêm dòng này
            references: {
                model: 'busStop',
                key: 'id_busstop'
            }
        },
        stt_busstop: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'RouteBusStop',
        tableName: 'route_busstop',
        timestamps: false,
        id: false //  Thêm dòng này để tắt tự động tìm cột 'id'
    });

    return RouteBusStop;
};