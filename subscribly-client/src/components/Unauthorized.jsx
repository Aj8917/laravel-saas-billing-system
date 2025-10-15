import React from 'react'
import { Link } from 'react-router-dom';
const Unauthorized = () => {
  return (
   <div style={styles.container}>
      <h1 style={styles.heading}>403 - Unauthorized</h1>
      <p style={styles.message}>
        You do not have permission to access this page.
      </p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
  
}
const styles = {
  container: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#ff4d4f',
  },
  message: {
    fontSize: '1.2rem',
    margin: '20px 0',
  },
  link: {
    textDecoration: 'none',
    color: '#1890ff',
    fontSize: '1rem',
  },
};
export default Unauthorized