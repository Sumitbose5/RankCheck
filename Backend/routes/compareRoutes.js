const express = require('express');
const router = express.Router();

const { handleComparison } = require('../controllers/compareController');

router.post("/res", handleComparison);

module.exports = router;