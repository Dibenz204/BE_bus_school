const db = require('../models/index.js');
const connectDB = require('../config/connectDB.js');

const createNewUser = async (data) => {
    try {
        await db.User.create({
            id_user: data.id_user,
            name: data.name,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            address: data.address,
            role: data.role
        });
        return 'Create new user succeed!';
    } catch (e) {
        throw e;
    }
};

module.exports = { createNewUser };
