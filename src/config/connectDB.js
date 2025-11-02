const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'quanlyxebus',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || null,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: '+07:00',
            connectTimeout: 60000,
            // ✅ THÊM PHẦN NÀY - Disable SSL verification cho Railway
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false
        },
        timezone: '+07:00'
    }
);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully to:', process.env.DB_HOST);
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        throw error;
    }
}

module.exports = connectDB;