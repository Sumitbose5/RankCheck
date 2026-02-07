const User = require("../models/user");
const Marks = require("../models/marks");

// exports.getLeaderboard = async(req, res) => {
//     try{
//         // sort data
//         const regyear = req.query.reg;
//         const sem = req.query.sem;
//         let query = Marks.find({regyear, sem});

//         if(req.query.sort) {
//             query = query.sort(req.query.sort); 
//         }

//         // pagination 
//         const page = req.query.page*1 || 1;
//         const limit = req.query.limit*1 || 10;

//         const skip = (page - 1) * limit;
//         query = query.skip(skip).limit(limit);

//         if(req.query.page) {
//             const marksCount = await Marks.countDocuments();
//             if(skip >= marksCount) {
//                 return res.status(404).json({
//                     success : false,
//                     message : "Page not found!"
//                 })
//             }
//         }

//         const marks = await query;

//         return res.status(200).json({
//             success : true,
//             marksLength : marks.length,
//             marks,
//             message : "Data sorted successfully!"
//         })

//     } catch(err) {
//         console.log("Error in rankController : ", err);
//         return res.status(500).json({
//             success : false,
//             message : err.message,
//         })
//     }
// }

exports.getLeaderboard = async (req, res) => {
    try {
        const { reg: regyear, sem, sort, page: reqPage, limit: reqLimit } = req.query;

        // 1. Build the base filter
        const filter = { regyear, sem };

        // 2. Setup Pagination variables
        const page = parseInt(reqPage) || 1;
        const limit = parseInt(reqLimit) || 10;
        const skip = (page - 1) * limit;

        // 3. Get total count based on the FILTER (important for accurate pagination)
        const totalRecords = await Marks.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        if (page > totalPages && totalRecords > 0) {
            return res.status(404).json({
                success: false,
                message: "Page not found!",
            });
        }

        // 4. Build Query with Stable Sorting
        let query = Marks.find(filter);

        if (sort) {
            // We append _id to ensure the sort is deterministic (stable)
            // This prevents the "duplicate data on different pages" bug
            query = query.sort(`${sort} _id`);
        } else {
            // Default sort: highest rank first, then by ID
            query = query.sort({ rank: 1, _id: 1 });
        }

        // 5. Execute Query with Pagination
        const marks = await query.skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            results: marks.length,
            totalRecords,
            totalPages,
            currentPage: page,
            marks,
            message: "Leaderboard retrieved successfully!",
        });

    } catch (err) {
        console.error("Error in getLeaderboard: ", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};