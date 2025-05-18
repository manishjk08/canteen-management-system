import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Form from './Form';
import Table from './Table';
import VoteCard from './VoteCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [editMenu, setEditMenu] = useState(null);
  const access = localStorage.getItem('access');
  const refresh=localStorage.getItem('refresh')
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchMenus = async () => {
    const res = await axios.get('http://127.0.0.1:8000/menus/', {
      headers: { Authorization: `Bearer ${access}` },
    });
    setData(res.data);
  };

  const deleteMenu = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/menus/${id}/`, {
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
    await axios.post(
      'http://127.0.0.1:8000/logout/',
      { refresh:refresh},
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

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className='w-full lg:w-2/3'>
              <Form
          editMenu={editMenu}
          setEditMenu={setEditMenu}
          fetchMenus={fetchMenus}/>
          </div >
         
         <div className='w-full lg:w-2/3'>
          <VoteCard/>
          </div>
        
        </div>
       
        <Table
          data={data}
          deleteMenu={deleteMenu}
          setEditMenu={setEditMenu}/>
      </div>
    </div>
  );
};

export default Dashboard;
