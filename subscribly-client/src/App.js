import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector, useStore } from 'react-redux';


import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin.jsx';
import LandingPage from './components/LandingPage';
import PlanSelection from './components/CompanyOnboarding/PlanSelection.jsx';
import CompanyDetails from './components/CompanyOnboarding/CompanyDetails.jsx';
import VendorDashboard from './components/Features/VendorDashboard.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Invoice from './components/Features/Basic/Invoice.jsx';
import InvoicePrint from './components/Features/Basic/InvoicePrint.jsx';
import InvoiceList from './components/Features/Basic/InvoiceList.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import Products from './components/Features/Pro/Products.jsx';
import ProInvoice from './components/Features/Pro/ProInvoice.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ProInvoiceList from './components/Features/Pro/ProInvoiceList.jsx';
import StockTopUp from './components/Features/Pro/StockTopUp.jsx';

axios.defaults.baseURL = 'http://localhost:8000/api';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const activePlan = useSelector((state) => state.auth.plan);
  const [appName, setAppName] = useState('');
  
  useEffect(() => {
    axios.get("get-appname")
      .then(response => {
        setAppName(response.data.name);
        document.title = response.data.name;
      })
      .catch(error => console.error('Error loading project name', error));
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage appName={appName} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/PlanSelection' element={<PlanSelection />} />
          <Route path='/companyDetails' element={<CompanyDetails />} />

          {/* Protected Routes for Basic + Pro Plans */}
          <Route
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedPlans={['Basic', 'Pro']}
                activePlan={activePlan}
              />
            }
          >
            <Route
              path='/'
              element={<DashboardLayout appName={appName} isAuthenticated={isAuthenticated} />}
            >
              <Route path='/VendorDashboard' element={<VendorDashboard />} />
              <Route
                path='/invoice'
                element={activePlan === 'Pro' ? <ProInvoice /> : <Invoice />}
              />
              <Route path='/PrintInvoice/:invoiceNo' element={<InvoicePrint />} />
              <Route path='/invoices' element={activePlan==='Pro' ?<ProInvoiceList /> :<InvoiceList />} />
            </Route>
          </Route>

          {/* Protected Routes for Pro Plan Only */}
          <Route
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedPlans="Pro"
                activePlan={activePlan}
              />
            }
          >
            <Route path='/' element={<DashboardLayout />}>
              <Route path='/products' element={<Products />} />
               <Route path='/stock' element={<StockTopUp />} />
            </Route>
            
          </Route>

          <Route path='/unauthorized' element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
