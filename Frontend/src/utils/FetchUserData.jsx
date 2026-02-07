import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchUserData = async (pageNumber, searchData) => { 
    try{
        // console.log("pageNum : ", pageNumber);
        const res = await axios.get(`${VITE_BASE_URL}/user-control/getAllUsers?page=${pageNumber}&limit=10&search=${searchData}`, 
            {withCredentials: true})

        // console.log(res?.data);
        return res.data || []; 

    } catch(err) {
        console.log("Error in fetch marks frontend : ", err); 
        throw err;
    }
}