const express = require('express');
const router = express.Router();

const { getLeaderboard } = require("../controllers/rankController");
const { sortMarks, assignRanksToUser } = require("../middlewares/rank")

router.get("/getRanks", getLeaderboard);

router.post("/assignRank", sortMarks, assignRanksToUser, (req, res) => {
    return res.status(200).json({
        success : true,
        message : "ranks updated successfully!"
    })
})

module.exports = router;