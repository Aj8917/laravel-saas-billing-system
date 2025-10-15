import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated ,activePlans}) => {
  const activatePlan = localStorage.getItem('plan')?.trim().toLowerCase();

  const allowedPlans = Array.isArray(activePlans)
    ? activePlans.map(plan => plan.trim().toLowerCase())
    : [activePlans.trim().toLowerCase()];

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedPlans.includes(activatePlan)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;