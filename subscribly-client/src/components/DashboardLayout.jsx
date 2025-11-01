import React, { useState, useEffect } from 'react';
import { Button, Offcanvas, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import Footer from './includes/Footer';
import Navbar from './includes/Navbar';


const DashboardLayout = ({ appName }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleShowSidebar = () => setShowMobileSidebar(true);
  const handleCloseSidebar = () => setShowMobileSidebar(false);

  return (
    <>
      <Navbar appName={appName} />

      {/* Mobile Sidebar Toggle Button */}
      <div className="d-lg-none mobile-menu-button text-center">
        <Button variant="primary" onClick={handleShowSidebar}>
          Open Menu
        </Button>
      </div>



      {/* Main layout wrapper */}
      <div className="dashboard-wrapper d-flex">
        {/* Sidebar for large screens */}
        <div className="sidebar d-none d-lg-block bg-light">
          <Nav className="flex-column p-3">
            <Nav.Link as={Link} to="/VendorDashboard">Dashboard</Nav.Link>
            <Nav.Link href="#products"></Nav.Link>
            <Nav.Link as={Link} to="/invoice">Invoice</Nav.Link>
            <Nav.Link as={Link} to="/invoices">Orders</Nav.Link>
            <Nav.Link as={Link} to="/products" >Products</Nav.Link>
            <Nav.Link as={Link} to="/stock" >Stock TopUp</Nav.Link>
            <Nav.Link href="#account">Account</Nav.Link>
            <Nav.Link href="#logout">Logout</Nav.Link>
          </Nav>
        </div>

        {/* Mobile Offcanvas Sidebar */}
        <Offcanvas show={showMobileSidebar} onHide={handleCloseSidebar} placement="start" className="d-lg-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/VendorDashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/invoice">Invoice</Nav.Link>
              <Nav.Link as={Link} to="/invoices">Orders</Nav.Link>
              <Nav.Link as={Link} to="/products" >Products</Nav.Link>
               <Nav.Link as={Link} to="/stock" >Stock TopUp</Nav.Link>
              <Nav.Link href="#account">Account</Nav.Link>
              <Nav.Link href="#logout">Logout</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className="content-area flex-grow-1 p-3">
          <Outlet />
        </div>
      </div>

      <Footer appName={appName} />
    </>
  );
};

export default DashboardLayout;
