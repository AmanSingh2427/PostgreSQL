import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('username');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/home" className="text-white">Home</Link>
          <Link to="/about" className="text-white">About</Link>
          <Link to="/contact" className="text-white">Contact</Link>
        </div>
        <div className="flex space-x-4">
          {username ? (
            <span className="text-white">{username}</span>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
          {username && (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
