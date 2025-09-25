import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin.jsx';
import LandingPage from './components/LandingPage';
import PlanSelection from './components/CompanyOnboarding/PlanSelection.jsx';
import CompanyDetails from './components/CompanyOnboarding/CompanyDetails.jsx';
import VendorDashboard from './components/Vendor/VendorDashboard.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Invoice from './components/Vendor/Invoice.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

axios.defaults.baseURL = 'http://localhost:8000/api';

function App() {
  // const appName = 'Subscriby';
  const [appName, setAppName] = useState('');
  useEffect(() => {
    axios.get("get-appname")
      .then(response => {
        setAppName(response.data.name);
        document.title = response.data.name
      })
      .catch(error => console.error('Error loading project name', error));
  }, []);
  const isAuthenticated = !!localStorage.getItem('token');


  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public,  Routes */}
          <Route path='/' element={<LandingPage appName={appName} />} />
          <Route path='/singup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/PlanSelection' element={<PlanSelection />} />
          <Route path='/companyDetails' element={<CompanyDetails />} />


          {/* vendor */}
          {/* Protected Routes */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route element={<DashboardLayout appName={appName} isAuthenticated={isAuthenticated} />}>
              <Route path="/VendorDashboard" element={<VendorDashboard />} />
              <Route path="/invoice" element={<Invoice />} />
            </Route>
          </Route>

        </Routes>
      </Router>

    </div>
  );
}

export default App;
