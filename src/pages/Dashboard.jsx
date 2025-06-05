import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Form from './Form';
import Table from './Table';
import VoteCard from './VoteCard';
import Report from '../components/Report';
import { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [editMenu, setEditMenu] = useState(null);
  const [todayMenuId, setTodayMenuId] = useState(null)
  const access = Cookies.get('access');
  const refresh = Cookies.get('refresh')
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchMenus = async () => {
    try {
      const res = await axiosInstance.get('/menus/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      setData(res.data);
      const today = new Date().toISOString().split('T')[0];
      const todayMenu = res.data.filter(menu => menu.date === today);
      setTodayMenuId(todayMenu);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      toast.error('Failed to load menus');
    }
  };

  const deleteMenu = async (id) => {
    try {
      await axiosInstance.delete(`/menus/${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      toast.success('Dish deleted successfully');
      fetchMenus();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete dish');
    }
  };

  

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleHome = () => {
    navigate('/dashboard');
  };


  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        '/logout/',
        { refresh: refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">

      <aside className="w-full lg:w-64 bg-white shadow-md p-6 flex flex-col justify-between lg:fixed lg:h-screen lg:top-0 lg:left-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
          <button
            onClick={handleHome}
            className="w-full text-left text-blue-600 hover:underline transition-colors"
          >
            Home
          </button>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="px-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>


      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col gap-10">


        <div className="flex flex-col xl:flex-row gap-6 xl:gap-10">


          <div className="lg:w-2/4">
            <Form
              editMenu={editMenu}
              setEditMenu={setEditMenu}
              fetchMenus={fetchMenus}
            />
          </div>


          <div className="lg:1/4 p-4 bg-white shadow-md rounded-xl border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">Today's Menu Votes</h2>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
              {todayMenuId?.length > 0 ? (
                todayMenuId.map(menu => (
                  <VoteCard key={menu.id} menu={menu} />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No menus available for today.</p>
              )}
            </div>
          </div>
        </div>


        <div>
          <Table
            data={data}
            deleteMenu={deleteMenu}
            setEditMenu={setEditMenu}
          />
        </div>


       <div>
        <Report/>
       </div>
      </main>
    </div>

  );
};

export default Dashboard;
