const express = require('express');
const router = express.Router();

// import middlewares
const { getMarksFromUniAPI, marksOperations, provideMarksData, getRollNo, getMarksDataforLogin, fetchRegNo } = require('../controllers/marksController');

// Get marks of students
router.post("/fetchMarks", getMarksFromUniAPI);

router.post("/test1", marksOperations); 

router.post("/getMarks", provideMarksData);  
 
router.get("/getRollNo", getRollNo); 

router.post("/getMarksData", getMarksDataforLogin);

router.get("/fetchRegNo", fetchRegNo);

module.exports = router;