import axiosInstance from '../components/axiosInstance'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface MenuItem{
  id: number;
  date: string;
  dishes: string;
  max_capacity: number;
}

const VoteCard = ({menu}:{menu:MenuItem}) => {
const[votedata,setVoteData]=useState<number>(0)
const access =Cookies.get('access')
    const fetchVotes=async()=>{
        try {
            const res= await axiosInstance.get(`/menus/${menu.id}/votes`,
              {
                headers:{
                  Authorization:`Bearer ${access}`
                }
              }
              
            )
          
            setVoteData(res.data.total_votes);
            
        } catch (error) {
              console.error('Vote fetch failed:', error);
        }
    }
   useEffect(() => {
    if (menu?.id){
      fetchVotes();
    } 
  }, [menu]);

  return (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-600 max-w-xs">
  <h2 className="text-lg font-bold mb-1 text-blue-800">{menu.dishes}</h2>
  <h3 className='text-sm font-light'>Max capacity: {menu.max_capacity}</h3>
  <p className="text-md font-bold"> <span className='text-purple-800 font-bold'>{votedata} </span> votes</p>
</div>
  )
}

export default VoteCard
