import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../util/Loader';

const PrivateRoute = ({ isAuthenticated, allowedPlans, activePlan, isAuthLoading }) => {
  // Normalize plan values to lowercase and trim spaces



  const normalizedActivePlan = typeof activePlan === 'string'
    ? activePlan.trim().toLowerCase()
    : '';


  let allowedPlanList = [];

  if (typeof allowedPlans === "string") {
    allowedPlanList = allowedPlans
      .split(",")
      .map(p => p.trim().toLowerCase());
  } else if (Array.isArray(allowedPlans)) {
    allowedPlanList = allowedPlans
      .map(p => p.trim().toLowerCase());
  }
  if (isAuthLoading) {
    return <Loader />; // You can replace this with a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  //console.log(allowedPlanList + " " + normalizedActivePlan)
  if (!allowedPlanList.includes(normalizedActivePlan)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
