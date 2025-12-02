// requestRoute.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/get-requests', requestController.getAllRequests);
router.get('/get-request', requestController.getRequestById);
router.get('/get-requests-by-parent', requestController.getRequestsByParent);
router.post('/create-request', requestController.createNewRequest);
router.put('/update-request', requestController.updateRequest);
router.delete('/delete-request', requestController.deleteRequest);

module.exports = router;