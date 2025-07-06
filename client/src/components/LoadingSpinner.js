import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full py-10">
      <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
