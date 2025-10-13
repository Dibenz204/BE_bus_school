const db = require('../models/index.js');
const CRUDservices = require('../services/crud-services.js');

const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('sample.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error loading homepage');
    }
};

const getSampleEjs = (req, res) => {
    res.send('Hello World!');
};

const getCRUD = (req, res) => {
    res.render('crud_user.ejs');
};

const getCRUDpost = async (req, res) => {
    try {
        let message = await CRUDservices.createNewUser(req.body);
        console.log(message);
        return res.send('Welcome to post CRUD page');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error creating parent');
    }
};

module.exports = {
    getHomePage,
    getSampleEjs,
    getCRUD,
    getCRUDpost
};
