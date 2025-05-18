import axios from 'axios'
import React, { useEffect, useState } from 'react'

const VoteCard = () => {
const[votedata,setVoteData]=useState()
    
    const fetchVotes=async()=>{
        try {
            const res= await axios.get(`http://127.0.0.1:8000/menus/${votedata.id}/vote`)
            setVoteData(res)
            fetchVotes()
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        fetchVotes()
    },[])



  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4 h-full">
      <h2 className="text-lg font-semibold text-gray-800">Votes</h2>
      <p className="text-gray-600">Total Votes:{votedata} </p>
    </div>
  )
}

export default VoteCard
