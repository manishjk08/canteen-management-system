import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {  useForm } from 'react-hook-form';
import  axios  from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { logout } from '../features/auth/authSlice';
const Dashboard = () => {
  
  const [data, setData] = useState([]);

  
 
  
  const navigate=useNavigate()
  const handleHome=()=>{
    navigate('/dashboard')
  }
  const dispatch=useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    console.log(data)
    try {
         const res = await axios.post('http://127.0.0.1:8000/menus',data) 
        setData(res)
    }catch(error){
        console.error(error)
    }
    }
   

 

  


  const table = useReactTable({
    data,
    columns: [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Dishes',
        accessorKey: 'dishes',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Max Capacity',
        accessorKey: 'max_capacity',
        cell: (info) => <img src={info.getValue()} style={{width:110, height:80, borderRadius:5}} className=''/>
      },
      {
        header:"Action",
        accessorKey:"action",
        cell:({row})=>{
          return(
            <button className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600' onClick={()=>{
              setData((prev) => prev.filter(item => item.id !== row.original.id));
            }}>
              Delete </button>
          )
        }
          
        
      }
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLogout = () => {
    dispatch(logout())
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
 
  <aside className="w-full lg:w-64 bg-white shadow-md p-6 flex flex-col justify-between">
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
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </aside>

  
  <div className="flex-1 flex flex-col gap-10 p-4 sm:p-6 lg:p-8">
    
    <div className="w-full max-w-2xl ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-8 space-y-6 rounded-xl shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-700">Add New Dish</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input
            type="number"
            {...register('id', {
              required: 'Id is required',
              min: 1,
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter id"
          />
          {errors.id && (
            <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
          )}
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Dishes
  </label>

  <div className="space-y-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        value="Pizza"
        {...register('dishes', { required: 'Dish selection is required' })}
        className="mr-2"
      />
      Pizza
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        value="Burger"
        {...register('dishes', { required: 'Dish selection is required' })}
        className="mr-2"
      />
      Burger
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        value="Pasta"
        {...register('dishes', { required: 'Dish selection is required' })}
        className="mr-2"
      />
      Pasta
    </label>
  </div>

  {errors.dishes && (
    <p className="text-red-500 text-sm mt-1">{errors.dishes.message}</p>
  )}
</div>

      
        

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
         <input
            type="date"
            {...register('date', {
              required: 'Date is required',
              min: 1,
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Date"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
          <input
            type="number"
            {...register('max_capacity', { required: 'Capacity is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.max_capcity && (
            <p className="text-red-500 text-sm mt-1">{errors.max_capcity.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Dish
        </button>
      </form>
    </div>

   
    <div className="w-full overflow-x-auto rounded-xl shadow-md bg-white border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default Dashboard;
