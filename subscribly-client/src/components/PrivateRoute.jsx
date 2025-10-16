import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, allowedPlans }) => {
  const activePlan = localStorage.getItem('plan')?.trim().toLowerCase();

  const allowedPlan = Array.isArray(allowedPlans)
    ? allowedPlans.map(plan => plan.trim().toLowerCase())
    : [allowedPlans.trim().toLowerCase()];

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedPlan.includes(activePlan)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;