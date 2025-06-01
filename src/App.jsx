import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import RoleBasedRoute from './routes/RolebasedRoutes'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Vote from './pages/Vote'
function App() {
const router = createBrowserRouter([
{
  path:'/',
  Component:Login
},
{
  path:'/register',
  Component:Register
},

{
  element:<RoleBasedRoute allowedRoles={['Canteen Admin']} />,
  children:[
    {
      path:'/dashboard',
      Component:Dashboard
    }
]
},

{
  element:<RoleBasedRoute allowedRoles={['Employee']} />,
  children:[
    {
    path:"/vote",
    Component:Vote
  }
]
},


])



  return (
    <>
      <RouterProvider router={router}/>
     
    </>
  )
}

export default App