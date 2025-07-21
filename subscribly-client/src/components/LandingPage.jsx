import React from 'react'
import Home from './Home'
import Navbar from './includes/Navbar';
import Footer from './includes/Footer';


const LandingPage = ({appName}) => {
  return (
      <>
      <Navbar appName={appName} />
      <Home />
      <Footer appName={appName} />
    </>
)
}

export default LandingPage