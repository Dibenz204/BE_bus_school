'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class busStop extends Model {
        static associate(models) {
            busStop.belongsToMany(models.Route, {
                through: 'route_busstop',
                foreignKey: 'id_busstop',
                otherKey: 'id_route',
                as: 'routes'
            });
        }
    }

    busStop.init({
        id_busstop: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        name_station: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        toado_x: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        toado_y: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        describe: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        visible: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'busStop',
        tableName: 'busstop',
        timestamps: true,
        underscored: false
    });

    busStop.beforeCreate(async (busstop, options) => {
        const lastbusStop = await busStop.findOne({
            order: [['id_busstop', 'DESC']],
            attributes: ['id_busstop'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastbusStop && lastbusStop.id_busstop) {
            const currentNumber = parseInt(lastbusStop.id_busstop.replace('T', ''));
            nextNumber = currentNumber + 1;
        }

        busstop.id_busstop = `T${nextNumber.toString().padStart(3, '0')}`;

    });

    return busStop;
};

