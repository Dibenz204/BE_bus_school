
const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/login', userController.handleLogin);

router.get('/read_user', userController.handleGetAllUser);

router.get('/user-count-by-role', userController.getUserCountByRole);

router.get('/users-by-role', userController.getUserByRole);

router.post('/create-new-user', userController.postCreateNewUser);

router.delete('/delete-user', userController.handleDeleteUser);

router.put("/update-user", userController.handleUpdateUser);

module.exports = router;