const db = require('../models/index.js');
const connectDB = require('../config/connectDB.js');



const createNewUser = async (data) => {
    try {
        await db.User.create({
            id_user: data.id_user,
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthday: data.birthday,
            gender: data.gender,
            address: data.address,
            password: data.password,
            role: data.role
        });
        return 'Create new user succeed!';
    } catch (e) {
        throw e;
    }
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}


const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id_user: userId },
                raw: true
            })

            if (user)
                resolve(user)

            else
                resolve([])
        }
        catch (e) {
            throw e;
        }
    })
}

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id_user: data.id }  // Phải có 1 trường id ở trong editCRUD, để nó lấy được id để cập nhật dữ liệu
            })

            if (user) {
                user.name = data.name;
                user.phone = data.phone;
                user.password = data.password;
                user.email = data.email;
                user.address = data.address;

                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser);

            }
            else {
                resolve();
            }
        }
        catch (e) {
            throw (e);
        }
    })

    // console.log('data from service');
    // console.log(data);
}

const deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id_user: id }
            })

            if (user) {
                await user.destroy();
            }
            resolve(); //return
        }
        catch (e) {
            reject(e);
        }
    })
}


module.exports = { createNewUser, getAllUser, getUserInfoById, updateUser, deleteUserById };
