import axios from 'axios';

export const fetchMarks = async (userDetails, semester) => {
    try {
        // console.log("user details inside fetchMarks:", userDetails);
        const res = await axios.post(
            "https://rank-check.vercel.app/student/getMarksData",
            { userDetails, semester },
            { withCredentials: true } 
        );

        return res.data; // ✅ Return success status with data

    } catch (err) {
        console.log("Error in fetch marks frontend:", err.response?.data || err.message);

        return err; // ✅ Return an empty array instead of throwing an error
    }
};
