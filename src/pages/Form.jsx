import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Form = ({ editMenu, setEditMenu, fetchMenus }) => {
  const access = localStorage.getItem('access');

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editMenu) {
      reset(editMenu);
    }else{
        reset({
            dishes:"",
            date:"",
            max_capacity:""
        })
    }
  }, [editMenu, reset]);

  const onSubmit = async (data) => {
    try {
      if (editMenu) {
        await axios.put(`http://127.0.0.1:8000/edit/menus/${editMenu.id}/`, data, {
          headers: { Authorization: `Bearer ${access}` },
        });
        toast.success('Dish updated');
        setEditMenu(null);
        
      } else {
        await axios.post('http://127.0.0.1:8000/menus/create/', data, {
          headers: { Authorization: `Bearer ${access}` },
        });
      }
      fetchMenus();
      reset();
      toast.success('New Dish added');
    } catch (error) {
      console.error('Error submitting dish:', error);
    }
  };



  

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-8 space-y-6 rounded-xl shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-700">
          {editMenu ? 'Edit Dish' : 'Add New Dish'}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Input Dishes
          </label>
          <input
            type="text"
            placeholder="Input Dishes"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('dishes', { required: 'Enter dish' })}
          />
          {errors.dishes && <p className="text-red-500 text-sm mt-1">{errors.dishes.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
          <input
            type="number"
            {...register('max_capacity', { required: 'Capacity is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.max_capacity && (
            <p className="text-red-500 text-sm mt-1">{errors.max_capacity.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {editMenu ? 'Update Dish' : 'Add Dish'}
        </button>
      </form>
    </div>
  );
};

export default Form;
