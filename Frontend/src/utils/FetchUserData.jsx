import axios from 'axios';

export const fetchUserData = async (pageNumber, searchData) => { 
    try{
        // console.log("pageNum : ", pageNumber);
        const res = await axios.get(`https://rank-check.vercel.app/user-control/getAllUsers?page=${pageNumber}&limit=10&search=${searchData}`, 
            {withCredentials: true})

        // console.log(res?.data);
        return res.data || []; 

    } catch(err) {
        console.log("Error in fetch marks frontend : ", err); 
        throw err;
    }
}