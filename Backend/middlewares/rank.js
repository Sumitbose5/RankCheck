// sortMarks middleware
const Marks = require("../models/marks");

exports.sortMarks = async (req, res, next) => {
    try {
        // Only get marks (add filtering if needed)
        const { className } = req.body;
        let query = Marks.find({class_name: className});

        // Sort by total_marks as number (descending)
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
// exports.assignRanksToUser = async (req, res, next) => {
//     try {
//         const sortedMarks = req.data;
//         const { className } = req.body;

//         if (!sortedMarks || sortedMarks.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Sorted Marks not found in assignRanksToUser",
//             });
//         }

//         let prevMarks = null;
//         let currentRank = 1;

//         for (let i = 0; i < sortedMarks.length; i++) {
//             const currStudent = sortedMarks[i];
//             const currentMarks = currStudent.total_marks;

//             if (i > 0 && currentMarks !== prevMarks) {
//                 currentRank = i + 1;
//             }

//             await Marks.updateOne(
//                 { 
//                     rollNumber: currStudent.rollNumber,
//                     class_name: className,
//                     sem: currStudent.sem
//                 },
//                 { $set: { rank: currentRank } }
//             );

//             prevMarks = currentMarks;
//         }

//         next();
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// };

exports.assignRanksToUser = async (req, res, next) => {
    try {
        const sortedMarks = req.data; 
        const { className } = req.body;

        if (!sortedMarks || sortedMarks.length === 0) {
            return res.status(404).json({ success: false, message: "No marks found" });
        }

        let prevMarks = null;
        let currentRank = 0;
        const bulkOps = []; // Array to store all update operations

        for (let i = 0; i < sortedMarks.length; i++) {
            const currStudent = sortedMarks[i];
            const currentMarks = currStudent.total_marks;

            // Increment rank only when marks change
            if (currentMarks !== prevMarks) {
                currentRank++;
            }

            // Push the update instruction to our bulk array
            bulkOps.push({
                updateOne: {
                    filter: { 
                        rollNumber: currStudent.rollNumber, 
                        class_name: className, 
                        sem: currStudent.sem 
                    },
                    update: { $set: { rank: currentRank } }
                }
            });

            prevMarks = currentMarks;
        }

        // Execute all updates in one single database trip
        if (bulkOps.length > 0) {
            await Marks.bulkWrite(bulkOps);
        }

        next();
    } catch (err) {
        console.error("Rank Assignment Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};