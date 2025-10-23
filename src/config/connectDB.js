// import { Sequelize } from 'sequelize';
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('quanlyxebus', 'root', null, {
    host: 'localhost',
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
    }
}

// export default connectDB;
module.exports = connectDB;