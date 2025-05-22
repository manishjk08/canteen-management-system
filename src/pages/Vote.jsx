import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import DigitalClock from '../components/DigitalClock'
const Vote = () => {
  const access = localStorage.getItem('access')
  const refresh = localStorage.getItem('refresh')
  const username = localStorage.getItem('username')
  const dispatch = useDispatch()

  const [menu, setMenu] = useState([])
  const [votedMenuId, setVotedMenuId] = useState(null)
  const [votingClosed,setVotingClosed]=useState(false)
  const today = new Date().toISOString().split('T')[0];

  const getTodayMenu = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/menus/', {
        headers: { Authorization: `Bearer ${access}` },
      })
      const todayMenu = res.data.filter((menu) => menu.date === today)
      setMenu(todayMenu)
    } catch (error) {
      console.error('Failed to get todays menus:', error)
    }
  }

  const submitvote = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/votes/`,
        {
          menu: id,
          will_attend: true,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      setVotedMenuId(id)
    } catch (error) {
      console.error("Vote failed:", error.response?.data || error.message)
    }
  }

  const CheckVote = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/votes/list', {
        headers: { Authorization: `Bearer ${access}` },
      })

      const voted = res.data.votes[0]
      if (voted) {
        setVotedMenuId(voted.menu)
      }
    } catch (error) {
      console.error("Vote check failed:", error)
    }
  }

  useEffect(()=>{
    const checkVotingStatus=()=>{
      const now=new Date()
      const endTime=new Date()
      endTime.setHours(17,0,0,0)
      if(now>endTime){
        setVotingClosed(true)
      }
    }
      checkVotingStatus()
      const interval=setInterval(checkVotingStatus,6000)
      return ()=>clearInterval(interval)
  },[])




  const handleLogout = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/logout/',
        { refresh: refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
      dispatch(logout())
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message)
    }
  }

  useEffect(() => {
    getTodayMenu()
    CheckVote()
  }, [])

  return (
    <div className="p-4 ">
      <h1 className="text-3xl uppercase mb-4">Welcome {username}</h1>
      <div className='flex gap-5 justify-center text-gray-800 font-medium'>
       <h1 className='text-2xl'>Voting closes at 5 pm</h1>
        <DigitalClock/>
      </div>
      
      <button
        onClick={handleLogout}
        className="px-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Logout
      </button>
      <div className="flex flex-wrap justify-center gap-6">
      {menu.length > 0 ? (
        menu.map((menu) => (
          <div
            key={menu.id}
            className="max-w-sm  bg-white shadow-lg rounded-2xl overflow-hidden mt-6 "
          >
            <div className="p-6 text-center ">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
                🍽️ Today's Menu
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">ID:</span> {menu.id}
                </p>
                <p>
                  <span className="font-medium">Dish:</span> <span className='font-bold'>{menu.dishes}</span>
                </p>
              </div>
              <button
                onClick={() => submitvote(menu.id)}
                disabled={ votingClosed }
                className={`w-full mt-6 px-4 py-2 rounded-xl text-white font-semibold transition-colors duration-300 ${votedMenuId === menu.id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : votedMenuId !== null || votingClosed
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {votedMenuId === menu.id ? '✅ You have Voted' : "🍴 I'll Attend"}
              </button>
            </div>
          </div>
        ))
      ) : <h1 className='text-4xl text-center'>NO menus to display today</h1>}

    </div>
   
    </div>
  )
}

export default Vote
