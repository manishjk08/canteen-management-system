import { createSlice,  } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode';


const access=localStorage.getItem('access')
const refresh=localStorage.getItem('refresh')
const role=localStorage.getItem('role')
const username=localStorage.getItem('username')
let user=null;
if(access  ){
     const accessdecoded=jwtDecode(access)
     user = accessdecoded
}
const authSlice =createSlice({
    name:'auth',
    initialState:{
        user,
        access:access||null,
        refresh:refresh||null,
        role:role||null,
    },
    reducers:{
        login:(state,action)=>{
           state.access=action.payload.access;
           state.refresh=action.payload.refresh;
           state.role=action.payload.role;
           state.user={ role: action.payload.role }
           localStorage.setItem('access',action.payload.access)
           localStorage.setItem('refresh',action.payload.refresh)
           localStorage.setItem('role',action.payload.role)
           localStorage.setItem('username',action.payload.username)
           
        },
        logout:(state)=>{
            state.access=null;
            state.refresh=null;
            state.role=null;
            state.user=null;
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            localStorage.removeItem('role')
            localStorage.removeItem('username')
        }
    }
})
export const { login,logout } = authSlice.actions;
export default authSlice.reducer