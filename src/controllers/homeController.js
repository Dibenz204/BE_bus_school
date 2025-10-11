// const { get } = require("../routes/web")
// const connection = require("../config/database")
// import { get } from '../routes/web.js';


import connection from '../config/database.js';
import db from '../models/index.js';
// import CRUDservices from '../services/CRUDservices';


const getHomePage = async (req, res) => {
    try {
        let data = await db.Parent.findAll();
        return res.render('sample.ejs', {             //trả về file ejs và truyền dataUser xuống file ejs để hiển thị
            data: JSON.stringify(data)                //Chuyển kết quả dạng object sang dạng chuỗi json để trả về cho client
        });
    } catch (e) {
        console.log(e);
    }
}

const getSampleEjs = async (req, res) => {
    res.send('Hello World!')
}

const getCRUD = async (req, res) => {
    res.render('crud_parent.ejs')
}


let getCRUDpost = async (req, res) => {
    // let message = await CRUDservices.createNewParent(req.body);
    // console.log(message);
    console.log(req.body);
    return res.send('Welcome to post CRUD   page');
}

const getDataFromDB = (req, res) => {
    let user = []

    connection.query(
        'select * from client',
        function (err, results, fields) {
            user = results; //Lấy kết quả từ database gán vào biến user
            console.log(">>>>>> results: ", results);

            res.send(JSON.stringify(user)) //Chuyển kết quả dạng object sang dạng chuỗi json để trả về cho client
        }
    )
}

// module.exports = {
//     getHomePage,
//     getSampleEjs,
//     getDataFromDB
// }


export { getHomePage, getSampleEjs, getDataFromDB, getCRUD, getCRUDpost };