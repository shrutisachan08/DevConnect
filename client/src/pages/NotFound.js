import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-2 rounded bg-orange-500 hover:bg-orange-600 transition text-white"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
