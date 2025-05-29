import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import Cookies from 'js-cookie'
const Vote = () => {
  const access = Cookies.get('access')
  const refresh = Cookies.get('refresh')
  const username = Cookies.get('username')
  const role=Cookies.get('role')
  const dispatch = useDispatch()

  const [menu, setMenu] = useState([])
  const [votedMenuId, setVotedMenuId] = useState(null)
  const [votingClosed,setVotingClosed]=useState(false)
  const [timeLeft,setTimeLeft]=useState('')
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

useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const closingTime = new Date();
      closingTime.setHours(17, 0, 0, 0);
      const diff = closingTime - now;

      if (diff > 0) {
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('00:00:00');
        setVotingClosed(true)
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);



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
      <div className='flex gap-5 justify-between'>
        <h1 className="text-3xl uppercase mb-4">Welcome <span className='text-red-500'>{username}</span>  </h1>
        <div>
          <span className='font-extralight bg-blue-400 rounded p-0.5 mx-1 text-white text-xs'>{role}</span>
          <button
        onClick={handleLogout}
        className="px-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Logout
      </button>
        </div>
      
      </div>
      
     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">🍽️ Today's Lunch Menu</h1>
        {menu.length > 0 ? (
          menu.map((menuItem) => (
            <div
              key={menuItem.id}
              className="bg-gray-100 rounded-sm shadow-sm w-full mb-4"
            >
              <div className="p-3">
                <p className='font-bold'>ID: <span className='font-bold text-grayCookies-900'>{menuItem.id}</span></p>
                <p className='text-sm font-light'>{menuItem.date}</p>
                <p className="font-bold text-xl mt-1">{menuItem.dishes}</p>

                <button
                  onClick={() => submitvote(menuItem.id)}
                  disabled={votingClosed || votedMenuId !== null}
                  className={` mt-1 px-4 py-2 rounded-xl text-white font-semibold transition-colors duration-300 ${
                    votedMenuId === menuItem.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : votedMenuId !== null || votingClosed
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {votedMenuId === menuItem.id ? '✅ You have Voted' : "🍴 I'll Attend"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-2xl text-center text-gray-600">No menus to display today</h2>
        )}
      

      <div className="mt-10 bg-gray-100 border border-gray-300 rounded-lg p-4 text-center max-w-md mx-auto">
        <p className="text-lg text-gray-800">Voting closes at 5 PM</p>
        <p className="text-2xl font-semibold text-red-500 mt-2">{timeLeft}</p>
        
      </div>
    </div>
   
    </div>
  )
}

export default Vote
