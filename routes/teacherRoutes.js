const express = require('express');

const teacherController = require("../controller/teacherController");

const router = express.Router();
router.post('/register',teacherController.register);
router.get('/commonstudents',teacherController.commonStudents);
router.post('/suspend',teacherController.suspend);
router.post('/retrievefornotifications',teacherController.retrievefornotifications)

module.exports = router;
