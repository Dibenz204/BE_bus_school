// evaluateRoute.js
const express = require('express');
const router = express.Router();
const evaluateController = require('../controllers/evaluateController');

router.get('/get-evaluates', evaluateController.getAllEvaluates);
router.get('/get-evaluate', evaluateController.getEvaluateById);
router.get('/get-evaluates-by-parent', evaluateController.getEvaluatesByParent);
router.post('/create-evaluate', evaluateController.createNewEvaluate);
router.put('/update-evaluate', evaluateController.updateEvaluate);
router.delete('/delete-evaluate', evaluateController.deleteEvaluate);

module.exports = router;