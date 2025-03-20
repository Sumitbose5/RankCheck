import axios from 'axios';

export const fetchCompare = async (userDetails, semester) => {
    try{
        // console.log("user details inside fetchMarks : ", userDetails);
        const res = await axios.post("https://rank-check.vercel.app/compare/res", 
            { userDetails, semester }, 
            { withCredentials: true })

        return res.data || [];
 
    } catch(err) {
        console.log("Error in fetch marks frontend : ", err);
        throw err;
    }
}