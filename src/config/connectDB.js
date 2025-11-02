const { Sequelize } = require('sequelize');

// Khởi tạo Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'quanlyxebus',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || null,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        timezone: '+07:00',
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: '+07:00',
            ...(process.env.NODE_ENV === 'production' && {
                ssl: {
                    rejectUnauthorized: false
                }
            })
        }
    }
);

// Hàm connect DB
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = connectDB;
module.exports.sequelize = sequelize;



// const { Sequelize } = require('sequelize');


// const sequelize = new Sequelize(
//     process.env.DB_NAME || 'quanlyxebus',
//     process.env.DB_USER || 'root',
//     process.env.DB_PASSWORD || null, {

//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: false,

//     dialectOptions: {
//         dateStrings: true,
//         typeCast: true,
//         timezone: '+07:00'
//     },
//     timezone: '+07:00'
// });

// let connectDB = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//         throw error;
//     }
// }

// module.exports = connectDB;
