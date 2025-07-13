import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../features/auth/authSlice'
import axiosInstance from '../../components/axiosInstance'
import { useState } from 'react'

interface LoginData{
    username: string;
    password: string;
}
const Login = () => {
  
    const [error,setError]=useState<string>('')
    const navigate=useNavigate()
    const dispatch =useDispatch()
    const {register,
    handleSubmit,
    formState:{errors}
    }=useForm<LoginData>()

    const handleRegister=()=>{
        navigate('/register')
    }
   


    const onSubmit = async(data:LoginData)=>{
      try {
         const res = await axiosInstance.post('/login/',data) 
      dispatch(login({
        access:res.data.access,
        refresh:res.data.refresh,
        role:res.data.role,
        username:res.data.username,
      }))
      const role=res.data.role
      if(role==='Canteen Admin'){
        navigate ('/dashboard')
      }else{
        navigate('/vote')
      }
      setError('')
      } catch (err) {
        
    let message = 'Login failed';
    if (err.response?.status === 400 || err.response?.status === 401) {
      message = 'Invalid username or password';
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
        <h1 className='mb-10 text-2xl font-bold'>Canteen Management System</h1>
  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-64">
    <input
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('username', { 
        required: 'Username is required',
        minLength:{
            value:5,
            message:'UserName is incorrect'

        } 
    })}
      placeholder="Username"
    />
    {errors.username&& <p className='text-red-500'>{String(errors.username.message)}</p>}
    <input
      type="password"
      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      {...register('password', { 
        required: 'Password is required',
        minLength:{
            value:8,
            message:'Password is incorrect'
        } 
    })}
      placeholder="Password"
    />
    {errors.password && <p className='text-red-500'>{String(errors.password.message)}</p>}
    <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
      Login
    </button>
    {error && <p className="text-red-500 text-sm text-center mt-2" >{error}</p>}
    
    <p className="text-center text-gray-500">Don't have an account?</p>
    <button type='button' className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600" onClick={handleRegister}>
      Register
    </button>
  </form>
</div>

  )
}

export default Login