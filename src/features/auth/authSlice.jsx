import { createSlice,  } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie'


const access=Cookies.get('access')
const refresh=Cookies.get('refresh')
const role=Cookies.get('role')

let user=null;
if(access){
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
            Cookies.remove('access')
            Cookies.remove('refresh')
            Cookies.remove('role')
            Cookies.remove('username')
        }
    }
})
export const { login,logout } = authSlice.actions;
export default authSlice.reducer