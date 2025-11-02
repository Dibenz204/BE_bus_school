
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
    process.env.DB_NAME || 'quanlyxebus',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || null, {

    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,

    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '+07:00'
    },
    timezone: '+07:00'
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = connectDB;