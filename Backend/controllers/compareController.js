const Marks = require("../models/marks");
const User = require("../models/user");
const { romanToInt } = require("../utils/romanToInt");

exports.handleComparison = async(req, res) => { 
    try{
        // fetch the login data 
        const { userDetails, semester } = req.body;
 
        // search the user with the login data 
        const user = await User.findOne({
            $or: [{ email: userDetails }, { username: userDetails }, {roll_no: userDetails}]
        });

        // find it in the Marks obj
        const userx = await Marks.findOne({
            rollNumber: userDetails,
            sem: semester,
        })

        // Convert the semester to semIndex
        const semIndex = romanToInt(semester);

        // get the marks ID from the user (check if anyone has the data)
        const marksID = user?.marks[semIndex - 1] || userx?._id;  // //make the index dynamic according to semesters, here 0 means sem 1

        if(!marksID) { 
            return res.status(404).json({
                success : false,
                message : "Marks not found with given id",
            })
        }

        // get the subjects marks (using the marksID)
        const marks = await Marks.findById(marksID);
        let studentName = marks.studentName;
        studentName = studentName.split(" ")[0];
        const subjectMarks = marks.subjects;
        const total_marks = marks.total_marks;
        const len = subjectMarks.length;
        const percentage = ((total_marks / 500) * 100).toFixed(2);
        const rank = marks.rank;

        return res.status(200).json({
            success : true,
            marksID,
            rank,
            studentName,
            subjectMarks, 
            total_marks,
            percentage,
            message : "Data fetched successfully!"
        })

    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success : false,
            message : "Error in fetching marks data!"
        })
    }
}