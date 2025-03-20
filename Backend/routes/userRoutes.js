const express = require('express');
const router = express.Router();

const { getAllUsers, deleteUser } = require('../controllers/userController');

router.get("/getAllUsers", getAllUsers);

router.delete("/deleteUser/:id", deleteUser)

module.exports = router; 