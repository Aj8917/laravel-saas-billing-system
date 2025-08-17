import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';


function App() {
 // const appName = 'Subscriby';
  const [appName , setAppName]=useState('');
 useEffect(()=>{
  axios.get("http://127.0.0.1:8000/api/get-appname")
       .then(response=>{
          setAppName(response.data.name);
          document.title=response.data.name
       })
         .catch(error => console.error('Error loading project name', error));
}, []);
      

 
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={ <LandingPage appName={appName} />}/>
          <Route path='/singup' element={<Signup />} />
        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
