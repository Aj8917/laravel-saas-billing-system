import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './components/Signup';
import Signin from './components/Signin.jsx';
import LandingPage from './components/LandingPage';

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



  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage appName={appName} />} />
          <Route path='/singup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
