import axiosInstance from '../../components/axiosInstance'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {  useNavigate } from 'react-router-dom'
import {toast} from 'react-hot-toast'

const Register = () => {
  const[error,setError]=useState('')
const navigate=useNavigate()

const {register,
    handleSubmit,
    formState:{errors,isSubmitting},
}=useForm()

const onSubmit=async(data)=>{
  try{
       await axiosInstance.post('/',{
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password,
      role: parseInt( data.role), 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
  })
  toast.success('Registration sucessfull')
   navigate('/')
  }catch (err) {
    let message = 'Registration failed';
    if (err.response?.status === 400 || err.response?.status === 401) {
      message = 'Invalid email';
    } else if (err.response?.data?.detail) {
      message = err.response.data.detail;
    } else if (err.response?.data?.message) {
      message = err.response.data.message;
    } else {
      message = err.message || 'Something went wrong';
    }
    setError(message);
  }

}


  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className='mb-10 text-2xl font-bold text-indigo-500'>Register </h1>
  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-64">
   
   <input
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('first_name', { 
        required: 'firstname is required',
    })}
      placeholder="FirstName"
    />

     <input
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('last_name', { 
        required: 'lastname is required',
    })}
      placeholder="LastName"
    />

     <input
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('email', { 
        required: 'Email is required',
    })}
      placeholder="Email"
    />

    <input
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('username', { 
        required: 'Username is required',
        minLength:{
            value:5,
            message:'UserName should be minimum 5 characters long'

        } 
    })}
      placeholder="Username"
    />
    {errors.username&& <p className='text-red-500 text-sm leading-none mt-0 mb-1'>{errors.username.message}</p>}
    <input
      type="password"
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('password', { 
        required: 'Password is required',
        minLength:{
            value:8,
            message:'Password should be mimimum 8 characters long'
        } 
    })}
      placeholder="Password"
    />
    {errors.password && <p className='text-red-500 text-sm leading-none mt-0 mb-1'>{errors.password.message}</p>}

       <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Choose a Role:</label>
      <select id="role" {...register("role",{required:'please select your role'})}  className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select...</option>
        <option value="2">Admin</option>
        <option value="1">Employee</option>
        
      </select>
      {errors.role && <p className='text-red-500 text-sm leading-none mt-0 mb-1' >{errors.role.message}</p>}
    
    <button type='submit' disabled={isSubmitting} className={`bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 ${isSubmitting?'opacity-50 cursor-not-allowed':""} `}>
      Register
      
    </button>
    {error && <p  className="text-red-500 text-sm text-center mt-2">{error}</p>}
  </form>
</div>
  )
}

export default Register
