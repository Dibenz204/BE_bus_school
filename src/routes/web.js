const express = require('express')
const { getHomePage, getSampleEjs, getDataFromDB, getCRUD, getCRUDpost } = require('../controllers/homeController.js');


// import express from 'express'
// import { getHomePage, getSampleEjs, getDataFromDB, getCRUD, getCRUDpost } from '../controllers/homeController.js';

const router = express.Router();

//Thay vì ta xài app.get thì ta xài router.get do router là 1 instance của express.Router()
router.get('/', getHomePage) //Khi có request GET tới '/', nó sẽ gọi hàm getHomePage bên homeController.js;

router.get('/api', getSampleEjs);

router.get('/crud', getCRUD);

router.post('/post-crud', getCRUDpost);

module.exports = router; //export (cách cũ) cái router này ra để bên ngoài có thể dùng được 
// export default router;

