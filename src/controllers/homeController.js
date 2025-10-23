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


//create
const postCRUD = async (req, res) => {
    try {
        let message = await CRUDservices.createNewUser(req.body);
        console.log(message);
        return res.send('Welcome to post CRUD page');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error creating parent');
    }
};

//read
const displaygetCRUD = async (req, res) => {
    let data = await CRUDservices.getAllUser();
    // console.log('----------------');
    // console.log(data);
    // console.log('----------------');

    // return res.json(data);
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}


//Lấy dữ liệu user ra để hiện thị trên form sửa
const editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservices.getUserInfoById(userId);
        // Cái này dùng để kiểm thử xem có hoạt động không
        // console.log('----------------------------');
        // console.log(userData);

        return res.render('editCRUD.ejs', {
            data: userData
        });
    }
    return res.send('id_user not found');
}

//Đây mới làm hàm update
const putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDservices.updateUser(data);   //Cái data này là lấy ở cái bảng editCRUD.ejs, mấy cái name = là nó sẽ lấy thông tin ở đó
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}

const deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservices.deleteUserById(id);
        return res.send('delete the user succeed');
    }
    else {
        return res.send('User not found');
    }

}


module.exports = {
    getHomePage,
    getSampleEjs,
    getCRUD,
    postCRUD,
    displaygetCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD
};
