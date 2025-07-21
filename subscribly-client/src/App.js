import { useEffect, useState } from 'react';
import './App.scss';
import axios from 'axios';
import LandingPage from './components/LandingPage';



function App() {
 // const appName = 'Subscriby';
  const [appName , setAppName]=useState('');
 useEffect(()=>{
  axios.get("http://127.0.0.1:8000/api/get-appname")
       .then(response=>{
          setAppName(response.data.name);
       })
         .catch(error => console.error('Error loading project name', error));
}, []);
      

 
  return (
    <div className="App">
      <LandingPage appName={appName} />
    </div>
  );
}

export default App;
