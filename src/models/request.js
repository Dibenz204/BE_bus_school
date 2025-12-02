'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        static associate(models) {
            Request.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'user'
            });
        }
    }

    Request.init({
        id_request: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        id_user: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'user',
                key: 'id_user'
            }
        },
        request_type: {
            type: DataTypes.ENUM('Xe bus', 'Trạm đón/trả', 'Tuyến đường', 'Khác'),
            allowNull: false,

        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Request',
        tableName: 'request',
        timestamps: true,
        underscored: false
    });

    Request.beforeCreate(async (request, options) => {
        const lastRequest = await Request.findOne({
            order: [['id_request', 'DESC']],
            attributes: ['id_request'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastRequest && lastRequest.id_request) {
            const currentNumber = parseInt(lastRequest.id_request.replace('R', ''));
            nextNumber = currentNumber + 1;
        }

        request.id_request = `R${nextNumber.toString().padStart(3, '0')}`;
    });

    return Request;
};

