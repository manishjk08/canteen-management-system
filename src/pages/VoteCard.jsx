import axios from 'axios'
import { useEffect, useState } from 'react'

const VoteCard = ({menu}) => {
const[votedata,setVoteData]=useState()
const access =localStorage.getItem('access')
    
    const fetchVotes=async()=>{
        try {
            const res= await axios.get(`http://127.0.0.1:8000/menus/${menu.id}/votes`,
              {
                headers:{
                  Authorization:`Bearer ${access}`
                }
              }
            )
            setVoteData(res.data.total_votes);
            
        } catch (error) {
            
        }
    }
   useEffect(() => {
    if (menu?.id){
      fetchVotes();
    } 
  }, [menu]);

  return (
    <div className="">
  <h1 className="text-base sm:text-lg text-gray-700 font-semibold mb-1 break-words">
    Dish: {menu.dishes}
  </h1>
  <p className="text-sm sm:text-base font-medium text-gray-600">
    Total Votes: <span className="font-bold text-gray-800">{votedata}</span>
  </p>
</div>
  )
}

export default VoteCard
