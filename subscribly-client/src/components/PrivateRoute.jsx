import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, allowedPlans, activePlan }) => {
  // Normalize plan values to lowercase and trim spaces



  const normalizedActivePlan = typeof activePlan === 'string'
    ? activePlan.trim().toLowerCase()
    : '';


  const allowedPlanList = Array.isArray(allowedPlans)
    ? allowedPlans.map(plan => plan.trim().toLowerCase())
    : [allowedPlans.trim().toLowerCase()];

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedPlanList.includes(normalizedActivePlan)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
