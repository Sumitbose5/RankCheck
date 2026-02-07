import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchRank = async (pageNumber, regyear, semester) => {
    try{
        // console.log("pageNum : ", pageNumber);
        const res = await axios.get(`${VITE_BASE_URL}/leaderboard/getRanks?sort=rank&page=${pageNumber}&limit=10&reg=${regyear}&sem=${semester}`, 
            {withCredentials: true})

        // console.log(res?.data);
        return res.data || []; 

    } catch(err) {
        console.log("Error in fetch marks frontend : ", err); 
        throw err;
    }
}