import { useEffect, useState } from 'react'
import axios from 'axios'

const Vote = () => {
const access=localStorage.getItem('access')
const username=localStorage.getItem('username')

const[menu,setMenu]=useState([])
 const fetchMenus = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/menus/', {
      headers: { Authorization: `Bearer ${access}` },
    });
    setMenu(res.data);
  } catch (error) {
    console.error('Failed to fetch menus:', error);
  }
};
  useEffect(() => {
    fetchMenus();
  }, []);
  return (
    <div >
      <h1>Welcome {username}</h1>
      <button className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600'>I will attend</button>
    </div>
  )
}

export default Vote
