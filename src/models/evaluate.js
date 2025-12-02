'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Evaluate extends Model {
        static associate(models) {
            Evaluate.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'user'
            });
            Evaluate.belongsTo(models.Schedule, {
                foreignKey: 'id_schedule',
                as: 'schedule'
            });
        }
    }

    Evaluate.init({
        id_evaluate: {
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
        id_schedule: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'schedule',
                key: 'id_schedule'
            }
        },
        star: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Evaluate',
        tableName: 'evaluate',
        timestamps: true,
        underscored: false
    });

    Evaluate.beforeCreate(async (evaluate, options) => {
        const lastEvaluate = await Evaluate.findOne({
            order: [['id_evaluate', 'DESC']],
            attributes: ['id_evaluate'],
            transaction: options?.transaction
        });

        let nextNumber = 1;
        if (lastEvaluate && lastEvaluate.id_evaluate) {
            const currentNumber = parseInt(lastEvaluate.id_evaluate.replace('E', ''));
            nextNumber = currentNumber + 1;
        }

        evaluate.id_evaluate = `E${nextNumber.toString().padStart(4, '0')}`;
    });

    return Evaluate;
};

