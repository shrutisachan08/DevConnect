import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setIsLoggedIn(true);
          if (res.data.user?.isAdmin) setIsAdmin(true);
        }
      })
      .catch((err) => {
        console.error('Navbar user fetch error:', err);
      });
  }, []);

  return (
    <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-white font-bold text-xl">DevConnect</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="text-gray-200 hover:text-white">
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="text-gray-200 hover:text-white">
              Dashboard
            </Link>
            <Link to="/matches" className="text-gray-200 hover:text-white">
              Matches
            </Link>
            <Link to="/profile" className="text-gray-200 hover:text-white">
              Profile
            </Link>
            <Link to="/chat" className="text-gray-200 hover:text-white">
              Chat
            </Link>
          </>
        )}

        {isAdmin && (
          <Link to="/admin" className="text-yellow-400 hover:text-yellow-200 font-semibold">
            Admin 👑
          </Link>
        )}

        {isLoggedIn && (
          <a
            href="http://localhost:5000/auth/logout"
            className="text-sm text-gray-300 hover:text-white"
          >
            Logout
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
