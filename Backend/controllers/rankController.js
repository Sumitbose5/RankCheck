const User = require("../models/user");
const Marks = require("../models/marks");

exports.getLeaderboard = async(req, res) => {
    try{
        // sort data
        const regyear = req.query.reg;
        const sem = req.query.sem;
        let query = Marks.find({regyear, sem});

        if(req.query.sort) {
            query = query.sort(req.query.sort); 
        }

        // pagination 
        const page = req.query.page*1 || 1;
        const limit = req.query.limit*1 || 10;

        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if(req.query.page) {
            const marksCount = await Marks.countDocuments();
            if(skip >= marksCount) {
                return res.status(404).json({
                    success : false,
                    message : "Page not found!"
                })
            }
        }

        const marks = await query;

        return res.status(200).json({
            success : true,
            marksLength : marks.length,
            marks,
            message : "Data sorted successfully!"
        })

    } catch(err) {
        console.log("Error in rankController : ", err);
        return res.status(500).json({
            success : false,
            message : err.message,
        })
    }
}