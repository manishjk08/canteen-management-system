import { createSlice,  } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'


const access=Cookies.get('access')
const refresh=Cookies.get('refresh')
const role=Cookies.get('role')
 type User={
    username?:string
    role:string
    [key:string]:any
 }

interface AuthState {
    role:string|null
    user:User|null
    access:string|null
    refresh:string|null
    isAuthenticated:boolean
}
const initialState:AuthState={
    role:role||null,
    user:null,
    access:access||null,
    refresh:refresh||null,
    isAuthenticated:false
}
const authSlice =createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action:{payload:{access:string,refresh:string,role:string,username:string}})=>{
           state.access=action.payload.access;
           state.refresh=action.payload.refresh;
           state.role=action.payload.role;
           state.user={ role: action.payload.role , username:action.payload.username }
           state.isAuthenticated=true
           Cookies.set('access',action.payload.access)
           Cookies.set('refresh',action.payload.refresh)
           Cookies.set('role',action.payload.role)
           Cookies.set('username',action.payload.username)
           
        },
        logout:(state)=>{
            state.access=null;
            state.refresh=null;
            state.role=null;
            state.user=null;
            state.isAuthenticated=false
            Cookies.remove('access')
            Cookies.remove('refresh')
            Cookies.remove('role')
            Cookies.remove('username')
        }
    }
})
export const { login,logout } = authSlice.actions;
export default authSlice.reducer