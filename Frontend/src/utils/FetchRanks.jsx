import axios from 'axios';

export const fetchRank = async (pageNumber, class_name, semester) => { 
    try{
        // console.log("pageNum : ", pageNumber);
        const res = await axios.get(`http://localhost:3000/leaderboard/getRanks?sort=rank&page=${pageNumber}&limit=10&cname=${class_name}&sem=${semester}`, 
            {withCredentials: true})

        // console.log(res?.data);
        return res.data || []; 

    } catch(err) {
        console.log("Error in fetch marks frontend : ", err); 
        throw err;
    }
}