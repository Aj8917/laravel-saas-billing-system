import Navbar from './includes/Navbar';
import Footer from './includes/Footer';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({appName}) => {
  return (
    <>
       <Navbar appName={appName} />
            <Outlet />
       <Footer appName={appName} />
    </>
  );
};

export default DashboardLayout;
