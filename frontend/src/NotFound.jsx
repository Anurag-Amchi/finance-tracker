import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '4rem' }}>404 Not Found</h1>
      <h2 style={{ fontSize: '2rem' }}>The requested page could not be found.</h2>
      <p style={{ fontSize: '1.2rem' }}>For Login/Signup, <Link to="/" style={{ color: 'blue' }}>Click Here</Link></p>
    </div>
  );
};

export default NotFound;