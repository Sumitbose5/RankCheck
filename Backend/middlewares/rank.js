// sortMarks middleware
const Marks = require("../models/marks");

exports.sortMarks = async (req, res, next) => {
    try {
        // Only get marks (add filtering if needed)
        let query = Marks.find();

        // Always sort by total_marks descending
        query = query.sort({ total_marks: -1 });

        const sortedMarks = await query;

        if (!sortedMarks || sortedMarks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No marks found!",
            });
        }

        req.data = sortedMarks;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// assignRanksToUser middleware
exports.assignRanksToUser = async (req, res, next) => {
    try {
        const sortedMarks = req.data;

        if (!sortedMarks || sortedMarks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sorted Marks not found in assignRanksToUser",
            });
        }

        let prevMarks = null;
        let rank = 1;

        for (let i = 0; i < sortedMarks.length; i++) {
            const currStudent = sortedMarks[i];

            if (i > 0 && currStudent.total_marks !== prevMarks) {
                rank++; // only increment when marks change
            }

            await Marks.updateOne(
                { rollNumber: currStudent.rollNumber },
                { $set: { rank } }
            );

            prevMarks = currStudent.total_marks;
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};