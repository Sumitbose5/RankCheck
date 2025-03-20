const User = require("../models/user");
const Marks = require("../models/marks");

exports.sortMarks = async(req, res, next) => {
    try{

        // When updating the code according to sem then find only those students who are of certain sem and registration year
        let query = Marks.find({});

        if(!query) {
            return res.status(404).json({
                success : false,
                message : "Marks not found!"
            })
        }

        if(req.query.sort) {
            query = query.sort(req.query.sort);
        }

        const sortedMarks = await query;

        req.data = sortedMarks;

        next();

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            message : err.message,
        })
    }
}


exports.assignRanksToUser = async(req, res, next) => {
    try{

        let sortedMarks = req.data;

        if(!sortedMarks) {
            return res.status(404).json({
                success : false,
                message : "Sorted Marks not found in assignRanksToUser",
            })
        }

        // traverse in the array sortedMarks and assign all the users 
        // (in the marks model, because users will be created only when they sign up, so assign the ranks to the marks OBJ) 
        // their ranks according to their position
        for (const [index, currStudent] of sortedMarks.entries()) {
            await Marks.updateOne(
                { rollNumber: currStudent.rollNumber },
                { $set: { rank: index + 1 } } // Corrected index
            );
        }        

        next();
    } catch(err) {
        return res.status(500).json({
            success : false,
            message : err.message,
        })
    }
}