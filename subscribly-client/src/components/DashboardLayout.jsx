import React, { useEffect, useState } from 'react';
import { Modal, Button, Offcanvas, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import Footer from './includes/Footer';
import Navbar from './includes/Navbar';
import { useSelector } from 'react-redux';
import axiosAuth from '../api/axiosAuth';
import messageHandler from '../util/messageHandler';

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
    { label: "Report", to: "#report", permission: "view_reports" },
    { label: "Logout", to: "#logout" } // no permission required
  ];

  // Filter sidebar items based on permissions
  useEffect(() => {
    if (permissions.length > 0) {
      const items = sidebarItems.filter(
        item => !item.permission || permissions.includes(item.permission)
      );
      setFilteredItems(items);
    }
  }, [permissions]);

  // State to control modal visibility
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(false);
  

  const handleCloseReportModal = () => setShowReportModal(false);
  const handleOpenReportModal = () => setShowReportModal(true);

  // Function to render Nav links (desktop & mobile)
  const renderNavLink = (item, isMobile = false) => {
    if (item.to === "#report") {
      return (
        <Nav.Link
          key={item.to}
          onClick={() => {
            handleOpenReportModal();
            if (isMobile) handleCloseSidebar();
          }}
        >
          {item.label}
        </Nav.Link>
      );
    } else if (item.to.startsWith("#")) {
      // handle other hash links if needed
      return (
        <Nav.Link
          key={item.to}
          href={item.to}
          onClick={isMobile ? handleCloseSidebar : undefined}
        >
          {item.label}
        </Nav.Link>
      );
    } else {
      return (
        <Nav.Link
          key={item.to}
          as={Link}
          to={item.to}
          onClick={isMobile ? handleCloseSidebar : undefined}
        >
          {item.label}
        </Nav.Link>
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const response = await axiosAuth.post('/pro-monthly-report', {
        month: selectedMonth,
      });
     
      // console.log('Report submitted:', selectedMonth);
      handleCloseReportModal(); // close modal after successful submission
      // navigate to report 
      setSelectedMonth()
    } catch (error) {
      console.error('Error submitting report:', error);
      setSelectedMonth()
      messageHandler('Failed to submit report','error');
    }
  }
  return (
    <>
      <Navbar appName={appName} />

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={handleCloseReportModal}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Report an Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h4 className="text-center mb-4 form-header">Monthly Report</h4>
              <div className="form-floating-label mb-4">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
                <label htmlFor="month">Month</label>
              </div>

            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReportModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

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
            {filteredItems.map(item => renderNavLink(item))}
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
              {filteredItems.map(item => renderNavLink(item, true))}
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
