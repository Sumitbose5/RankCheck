const User = require('../models/user');
const Marks = require('../models/marks');
const { romanToInt } = require('../utils/romanToInt');


// exports.marksOperations = async (req, res) => {
//     try {
//         const { roll_no } = req.body || req.query;
//         const semester = ['I', 'II', 'III', 'IV', 'V', 'VI'];
//         let class_name = "";

//         let checkMarks = await Marks.findOne({ rollNumber: roll_no, sem: semester[0] });

//         if (!checkMarks) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Roll Number not found",
//             });
//         }

//         const user = await User.findOne({ roll_no });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         let semIndex = 1;
//         let present = user.marks.includes(checkMarks._id);
//         if (present) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Marks ID already present in the user's record",
//                 marksID: checkMarks._id,
//             });
//         }

//         while (checkMarks && semIndex < semester.length) {
//             const marksID = checkMarks._id;
//             class_name = checkMarks.class_name;

//             await User.findByIdAndUpdate(
//                 user._id,
//                 {
//                     $push: { marks: marksID },
//                     $set: { class_name }
//                 },
//                 { new: true }
//             );

//             let subjectArr = checkMarks.subjects;
//             for (let i = 0; i < subjectArr.length; i++) {
//                 let subjectName = subjectArr[i].name;
//                 let marks = subjectArr[i].marks;
//                 let code = subjectArr[i].subjectCode;

//                 let totalStudents = await Marks.countDocuments({
//                     sem: checkMarks.sem,
//                     regyear: checkMarks.regyear,
//                     subjects: { $elemMatch: { name: subjectName, subjectCode: code } }
//                 });

//                 let lowerCount = await Marks.countDocuments({
//                     sem: checkMarks.sem,
//                     regyear: checkMarks.regyear,
//                     subjects: {
//                         $elemMatch: {
//                             name: subjectName,
//                             subjectCode: code,
//                             marks: { $lt: parseInt(marks) }
//                         }
//                     }
//                 });

//                 await Marks.updateOne(
//                     { _id: marksID, "subjects.name": subjectName },
//                     {
//                         $set: {
//                             "subjects.$.scoredMoreThan": lowerCount,
//                             "subjects.$.totalStudents": totalStudents
//                         }
//                     }
//                 );
//             }

//             checkMarks = await Marks.findOne({ rollNumber: roll_no, sem: semester[semIndex] });
//             semIndex++;
//         }

//         return res.status(200).json({
//             success: true,
//             class_name,
//             message: "Marks updated and Marks ID added successfully",
//         });

//     } catch (err) {
//         console.error("Error in marks operation controller:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Fetch data correctly!"
//         });
//     }
// };


// OLD CODE

exports.marksOperations = async (req, res) => {
    try {

        // Fetch the roll number from req.body
        const { roll_no } = req.query;

        // check user if the roll number is valid or not
        const isRollNoValid = await Marks.findOne({ rollNumber: roll_no });

        // if roll no is invalid
        if (!isRollNoValid) {
            return res.status(401).json({
                success: false,
                message: "Roll Number not found",
            })
        }
 
        // get the user using the roll_no
        const user = await User.findOne({ roll_no });
        const userID = user._id;

        // Add the marks id to the user fetched
        const marksID = isRollNoValid._id;
        const class_name = isRollNoValid.class_name;

        // search for marksID in marks array
        const present = user.marks.includes(marksID);
        if (present) {   // if present then simply return no need to add info's to the DB
            return res.status(200).json({
                success: true,
                message: "Marks ID already present in the user's record",
                marksID,
            });
        }

        await User.findByIdAndUpdate(
            userID,
            { 
                $push: { marks: marksID },
                $set: { class_name }  // Set class_name directly
            },
            { new: true },
        );

        let subjectArr = isRollNoValid.subjects; // Array of subjects for a student

        // calculates scoredMoreThan and totalStudents in the subject 
        for (let i = 0; i < subjectArr.length; i++) {
            let subjectName = subjectArr[i].name;
            let marks = subjectArr[i].marks;
            let code = subjectArr[i].subjectCode;

            let totalStudents = await Marks.countDocuments({
                sem: "I",
                regyear: "2023",
                subjects: { $elemMatch: { name: subjectName, subjectCode: code, } }
            });

            // Count students who scored less than current student's marks in this subject
            let lowerCount = await Marks.countDocuments({
                sem: "I",
                regyear: "2023",
                subjects: {
                    $elemMatch: {
                        name: subjectName,
                        subjectCode: code,
                        marks: { $lt: parseInt(marks) }  // Convert marks to Number
                    }
                }
            });
            // console.log("LowerCount : ", lowerCount);

            // let moreScoredPercentage = ((lowerCount / 59) * 100).toFixed(2);
            // console.log(moreScoredPercentage);

            // Update the `scoredMoreThan` field for the specific subject in the Marks collection
            await Marks.updateOne(
                { _id: marksID, "subjects.name": subjectName }, // Match the marks document and the specific subject
                {
                    $set: {
                        "subjects.$.scoredMoreThan": lowerCount,
                        "subjects.$.totalStudents": totalStudents
                    }
                } // Update the specific subject's `scoredMoreThan` field
            );
        }

        return res.status(200).json({
            success: true,
            class_name,
            message: "Data fetched successfully",
            marksID,
        })

    } catch (err) {
        console.log("Error in marks operation controller ", err);
        return res.status(500).json({
            success: false,
            message: "Fetch data correctly!"
        })
    }
}