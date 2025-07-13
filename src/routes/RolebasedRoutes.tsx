
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RolebasedRoutes = ({ allowedRoles }) => {
  const role = useSelector((state:any) => state.auth.role);
  const access = useSelector((state:any) => state.auth.access);
  if (!access) {
    return <Navigate to="/" />;
  }
  if (!allowedRoles.includes((role))) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default RolebasedRoutes;
