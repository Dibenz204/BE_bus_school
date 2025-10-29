

const express = require('express')
const { getHomePage, getSampleEjs, displaygetCRUD, getCRUD, postCRUD, putCRUD, editCRUD, deleteCRUD, postCreateStudent, getStudentList, deleteStudentById, updateStudentById } = require('../controllers/homeController.js');

const router = express.Router();

//Thay vì ta xài app.get thì ta xài router.get do router là 1 instance của express.Router()
router.get('/', getHomePage) //Khi có request GET tới '/', nó sẽ gọi hàm getHomePage bên homeController.js;

router.get('/api', getSampleEjs);

router.get('/crud', getCRUD);

router.post('/post-crud', postCRUD);  //được gọi bên view crud_user.ejs

router.get('/displaycrud', displaygetCRUD);

router.post('/put-crud', putCRUD);

router.get('/edit-crud', editCRUD);

router.get('/delete-crud', deleteCRUD);

router.post('/student/register', postCreateStudent);
router.get('/student/list', getStudentList);
router.delete('/student/delete/:id', deleteStudentById);
router.put('/student/update/:id', updateStudentById);

router.get('/crud-student', (req, res) => {
    res.render('crud_student');
});


module.exports = router; //export (cách cũ) cái router này ra để bên ngoài có thể dùng được
// export default router;

