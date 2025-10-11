const db = require('../models/index.js');
const connectDB = require('../config/connectDB.js');

const createNewParent = async (data) => {
    try {
        await db.Parent.create({
            id_parent: data.id_parent,
            name: data.name,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            address: data.address,
            status: data.status
        });
        return 'Create new parent succeed!';
    } catch (e) {
        throw e;
    }
};

module.exports = { createNewParent };
