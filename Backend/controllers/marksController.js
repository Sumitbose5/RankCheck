const User = require('../models/user');
const Marks = require('../models/marks');
const { romanToInt } = require('../utils/romanToInt');


const fetchData = async (roll_no, semester, class_name) => {   // get class_name as parameter
    try {
        console.log("Fetching roll number : ", roll_no);
        console.log("Semester : ", semester);
        const URL = `https://www.kuuniv.in/result/fetch/result/allcourse?course=FYUGP&rollno=${roll_no}&semester=${semester}&stream=nep`;
        const res = await fetch(URL);
        const data = await res.json();

        const subjectObj = data?.result[0];
        if (!subjectObj) {
            return;
        }

        // console.log("SubjectObj : ", subjectObj);
        const subjectArr = Array.from({ length: 6 }, (_, i) => {
            const index = i + 1;
            const subkey = `cores2p${index}`;
            return {
                name: subjectObj[subkey],
                subjectCode: subkey,
                marks: subjectObj[`tot${index}`],
            };
        }).filter(item => item.name !== undefined); // removes undefined subjects
        

        console.log("Subject Arr : ", subjectArr);

        // const subjectArr = Object.keys(subjectObj)
        //     .filter(key => key.startsWith("tot"))
        //     .map((subkey, index) => ({
        //         name: subjectObj[subkey],
        //         subjectCode: subkey,
        //         marks: subjectObj[`tot${index + 1}`],
        //     }));


        // Add additional subject (Digital Education), (News Writing and Reporting)
        // // make it dynamic according to semesters
        // change -> ges1p(1) , dsc(1)a_tot
        const semINT = romanToInt(semester);

        // if (semINT <= 3) {
        //     subjectArr.push({
        //         name: subjectObj[`ges1p${semINT}`], // Replacing number dynamically
        //         subjectCode: `ges1p${semINT}`, // Updating subject code
        //         marks: subjectObj[`dsc${semINT}a_tot`], // Updating marks key
        //     });
        // }



        // get all the data and put it in the DB
        const student = new Marks({
            rollNumber: subjectObj.rollno,
            studentName: subjectObj.sname,
            sem: subjectObj.semester,
            regyear: subjectObj.regyear,
            total_marks: subjectObj.grand_total,
            dob: subjectObj.dob,
            subjects: subjectArr,
            class_name: class_name,   // successfully entered in the Marks DB
        })

        // save the student's marks in the DB
        await student.save();

        // also update the user's marks array
        // but not everyone has signed up in the website 
        // that's why don't add the marksId to the user's marks array

        // those user's who have signed up provide them the marks id ---------------->

        //  get the marks id
        const marksOBJ = await Marks.findOne({
            rollNumber: roll_no,
            // class_name,  // removing this because user won't get the new data's class name
        })
        const marksID = marksOBJ._id;

        // push the marksID in the marks array of the signed up users
        try {
            const checkUser = await User.findOne({ roll_no });

            if (!checkUser) {
                console.log("User not found");
                return;
            }

            await User.findByIdAndUpdate(
                checkUser._id,
                { $push: { marks: marksID } },
                { new: true }
            );

            console.log("Marks updated successfully");

        } catch (error) {
            console.error("Error updating marks:", error);
        }


        console.log(`Roll number ${roll_no} successfully added to DB!`);

    } catch (err) {
        console.log(err.message);
    }
}

// Delay function to add a random pause
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.getMarksFromUniAPI = async (req, res) => {
    try {

        let start = req.body.rollFrom;
        let end = req.body.rollTo;
        const semester = req.body.semester;
        const regyear = req.body.year;
        const class_name = req.body.class_name;   // create an input field in the marks control (admin)

        console.log("We are here!")

        // Check if the marks are fetched for certain class (semester + regyear)
        const isFetched = await Marks.findOne({
            sem: semester,
            rollNumber: start  // assuming that you will fetch the class marks always from the starting roll number (ex : 20-79)
        })

        if (isFetched) {
            return res.status(400).json({
                success: false,
                message: "Marks for this class is already fetched!",
            })
        }

        while (start <= end) {
            let randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
            console.log(`Next request in ${randomDelay / 1000} seconds`);
            await delay(randomDelay);
            await fetchData(start, semester, class_name);  // also send class_name
            start++;
        }

        return res.status(200).json({
            success: true,
            message: "All students' data fetched and DB updated!"
        });

    } catch (err) {
        console.log("Error in marks Controller:", err.message);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// takes roll no as query and adds the marks id to the marks array in user &
// create the scoredMoreThan and totalStudents in the subject field in the subjects array in the marks obj
// ADD ALL THE MARKS ID IF A USER SIGNED IN LATELY, ex: if a user registers in sem-3, he must get the marks of prev sem-1 and 2 
// (/test1) ------------> RECTIFIED code is in test.js
// NEW CODE
exports.marksOperations = async (req, res) => {
    try {
        const { roll_no } = req.body || req.query;
        console.log("Roll number from setting up : ", roll_no)
        const semester = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        let class_name = "";

        let checkMarks = await Marks.findOne({ rollNumber: roll_no, sem: semester[0] });
        console.log("Marks for sem 1 : ", checkMarks);

        if (!checkMarks) {
            return res.status(401).json({
                success: false,
                message: "Roll Number not found",
            });
        }

        const user = await User.findOne({ roll_no });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let semIndex = 1;
        let present = user.marks.includes(checkMarks._id);
        if (present) {
            return res.status(200).json({
                success: true,
                message: "Marks ID already present in the user's record",
                marksID: checkMarks._id,
            });
        }

        while (checkMarks && semIndex < semester.length) {
            const marksID = checkMarks._id;
            class_name = checkMarks.class_name;

            await User.findByIdAndUpdate(
                user._id,
                {
                    $addToSet: { marks: marksID }, // Adds unique mark ID
                    $set: { class_name }
                },
                { new: true }
            );

            console.log("Class name set ?")

            let subjectArr = checkMarks.subjects;
            console.log("Subject Marks : ", subjectArr);
            for (let i = 0; i < subjectArr.length; i++) {
                let subjectName = subjectArr[i].name;
                let marks = subjectArr[i].marks;
                let code = subjectArr[i].subjectCode;

                let totalStudents = await Marks.countDocuments({
                    sem: checkMarks.sem,
                    regyear: checkMarks.regyear,
                    subjects: { $elemMatch: { name: subjectName, subjectCode: code } }
                });

                let lowerCount = await Marks.countDocuments({
                    sem: checkMarks.sem,
                    regyear: checkMarks.regyear,
                    subjects: {
                        $elemMatch: {
                            name: subjectName,
                            subjectCode: code,
                            marks: { $lt: parseInt(marks) }
                        }
                    }
                });

                await Marks.updateOne(
                    { _id: marksID, "subjects.name": subjectName },
                    {
                        $set: {
                            "subjects.$.scoredMoreThan": lowerCount,
                            "subjects.$.totalStudents": totalStudents
                        }
                    }
                );
            }

            checkMarks = await Marks.findOne({ rollNumber: roll_no, sem: semester[semIndex] });
            semIndex++;
        }

        return res.status(200).json({
            success: true,
            class_name,
            message: "Marks updated and Marks ID added successfully",
        });

    } catch (err) {
        console.error("Error in marks operation controller:", err);
        return res.status(500).json({
            success: false,
            message: "Fetch data correctly!"
        });
    }
};



exports.getMarksDataforLogin = async (req, res) => {
    try {

        // fetch the login data 
        const { userDetails, semester } = req.body;
        // console.log("Backend sem : ", semester);
        // console.log("UserDetails : ", userDetails);

        // search the user with the login data 
        const user = await User.findOne({
            $or: [{ email: userDetails }, { username: userDetails }, { roll_no: userDetails }]
        });

        // console.log("user : ", user)

        // Convert the roman semester to Integer for indexing
        const semIndex = romanToInt(semester);

        // get the marks ID from the user
        const marksIDLen = user.marks.length;
        if (marksIDLen <= (semIndex - 1)) {
            return res.status(404).json({
                success: false,
                message: "No Data Found!"
            })
        }
        const marksID = user?.marks[semIndex - 1];  // make the index dynamic according to semesters, here 0 means sem 1

        if (!marksID) {
            return res.status(404).json({
                success: false,
                message: "Marks not found with given id",
            })
        }

        // get the subjects marks (using the marksID)
        const marks = await Marks.findById(marksID);
        let studentName = marks.studentName;
        studentName = studentName.split(" ")[0];
        const subjectMarks = marks.subjects;
        // Find the best and worst subjects
        const sortedSubjects = [...subjectMarks].sort((a, b) => b.marks - a.marks);

        const bestScoringSubject = sortedSubjects[0].name;
        const worstScoringSubject = sortedSubjects[sortedSubjects.length - 1].name;

        const total_marks = marks.total_marks;
        const len = subjectMarks.length;
        const percentage = ((total_marks / 500) * 100).toFixed(2);
        const rank = marks.rank;
        const class_name = marks.class_name;


        // get the ranker's total_marks
        const rank1 = await Marks.findOne({ rank: 1 });
        const rank1tot_marks = rank1.total_marks;
        const rank3 = await Marks.findOne({ rank: 3 });
        const rank3tot_marks = rank3.total_marks;
        const rank10 = await Marks.findOne({ rank: 10 });
        const rank10tot_marks = rank10.total_marks;

        return res.status(200).json({
            success: true,
            marksID,
            class_name,
            rank,
            studentName,
            subjectMarks,
            bestScoringSubject,
            worstScoringSubject,
            total_marks,
            percentage,
            rank1tot_marks,
            rank3tot_marks,
            rank10tot_marks,
            message: "Data fetched successfully!"
        })

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error in fetching marks data!"
        })
    }
}


// Not Needed --------------------------------------------------------------->
// -------------------------------------------------------------------------->
exports.fetchRegNo = async (req, res) => {
    try {
        // Fetch all student marks records
        const allMarksObj = await Marks.find({});

        // Handle case where no marks exist
        if (allMarksObj.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Marks not found!"
            });
        }

        for (let i = 0; i < allMarksObj.length; i++) {
            let randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
            console.log(`Next request in ${randomDelay / 1000} seconds`);
            await delay(randomDelay);

            let roll_no = allMarksObj[i].rollNumber;
            let stID = allMarksObj[i]._id;
            await fetchFunc(roll_no, stID);
        }

        return res.status(200).json({
            success: true,
            message: "Reg number updated successfully!"
        });

    } catch (err) {
        console.error("Error in fetchRegNo: ", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const fetchFunc = async (roll_no, stID) => {
    try {
        const URL = `https://www.kuuniv.in/result/fetch/result/allcourse?course=FYUGP&rollno=${roll_no}&semester=I&stream=nep`;
        const res = await fetch(URL);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const stuInfo = data?.result?.[0];

        if (!stuInfo || !stuInfo.regno) {
            console.log(`No regno found for roll_no: ${roll_no}`);
            return;
        }

        const updatedMarks = await Marks.findByIdAndUpdate(
            stID,
            { $set: { regno: stuInfo.regno } },
            { new: true }  // Returns the updated document
        );

        console.log("Updated:", updatedMarks);

    } catch (err) {
        console.error(`Error fetching data for Roll No: ${roll_no}`, err);
    }
};

// fetch the mark object using the user marks object ID and return it as response along with percentage 
// (/getMarks)
exports.provideMarksData = async (req, res) => {
    try {
        const { userMarksId } = req.body;
        // console.log("Marks ID at backend : ",userMarksId);

        if (!userMarksId) {
            return res.status(400).json({
                success: false,
                message: "User Marks ID not found in marks controller",
            })
        }

        // search for marks id in marks DB ------->
        const marks = await Marks.findById(userMarksId);

        if (!marks) {
            return res.status(400).json({
                success: false,
                message: "Unable to fetch marks"
            })
        }

        const percentage = ((marks.total_marks / 500) * 100).toFixed(2);

        return res.status(200).json({
            success: true,
            message: "Marks fetched successfully",
            marks,
            percentage,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in provideMarksData controller"
        })
    }
}

exports.getRollNo = async (req, res) => {
    try {

        // data is of the user
        const { data } = req.query;

        // find the user
        const user = await User.findOne({
            $or: [{ email: data }, { username: data }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        // user found
        const roll_no = user.roll_no;
        return res.status(200).json({
            success: true,
            message: "Roll number fetched successfully!",
            roll_no,
        })

    } catch (err) {
        console.log("Error in getRollNo");
        return res.status(400).json({
            success: false,
            message: "Something went wrong in fetch Roll no"
        })
    }
}