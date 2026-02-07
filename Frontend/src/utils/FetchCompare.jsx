import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchCompare = async (userDetails, semester) => {
    try{
        // console.log("user details inside fetchMarks : ", userDetails);
        const res = await axios.post(`${VITE_BASE_URL}/compare/res`, 
            { userDetails, semester }, 
            { withCredentials: true })

        return res.data || [];
 
    } catch(err) {
        console.log("Error in fetch marks frontend : ", err);
        throw err;
    }
}