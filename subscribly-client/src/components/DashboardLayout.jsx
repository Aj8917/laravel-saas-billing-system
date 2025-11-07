import React, { useEffect, useState } from 'react';
import { Button, Offcanvas, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import Footer from './includes/Footer';
import Navbar from './includes/Navbar';
import { useSelector } from 'react-redux';

const DashboardLayout = ({ appName }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const handleShowSidebar = () => setShowMobileSidebar(true);
  const handleCloseSidebar = () => setShowMobileSidebar(false);

  const permissions = useSelector(state => state.auth.userData?.permissions || []);
  const [filteredItems, setFilteredItems] = useState([]);

  // Sidebar configuration with required permissions
  const sidebarItems = [
    { label: "Dashboard", to: "/VendorDashboard", permission: "view_dashboard" },
    { label: "Products", to: "/products", permission: "manage_products" },
    { label: "Invoice", to: "/invoice", permission: "manage_invoices" },
    { label: "Orders", to: "/invoices", permission: "manage_invoices" },
    { label: "Stock TopUp", to: "/stock", permission: "manage_stocks" },
    { label: "Account", to: "/account", permission: "manage_account" },
    { label: "Logout", to: "#logout" } // no permission required
  ];

  useEffect(() => {
  if (permissions.length > 0) {
    const items = sidebarItems.filter(
      item => !item.permission || permissions.includes(item.permission)
    );
    setFilteredItems(items);
  }
}, [permissions]); 
 
  // Filter sidebar items based on permissions

  return (
    <>
      <Navbar appName={appName} />

      {/* Mobile Sidebar Toggle Button */}
      <div className="d-lg-none mobile-menu-button text-center mb-3">
        <Button variant="primary" onClick={handleShowSidebar}>
          Open Menu
        </Button>
      </div>

      {/* Main layout wrapper */}
      <div className="dashboard-wrapper d-flex">
        {/* Sidebar for large screens */}
        <div className="sidebar d-none d-lg-block bg-light">
          <Nav className="flex-column p-3">
            {filteredItems.map(item => (
              <Nav.Link key={item.to} as={Link} to={item.to}>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Mobile Offcanvas Sidebar */}
        <Offcanvas
          show={showMobileSidebar}
          onHide={handleCloseSidebar}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {filteredItems.map(item => (
                <Nav.Link key={item.to} as={Link} to={item.to} onClick={handleCloseSidebar}>
                  {item.label}
                </Nav.Link>
              ))}
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
