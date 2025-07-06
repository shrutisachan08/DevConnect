import React from 'react';

const Login = () => {
  const handleGitHubLogin = () => {
 window.location.href = 'http://localhost:5000/auth/github';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-6">Welcome to DevConnect</h2>
      <p className="mb-4 text-lg text-gray-300">Connect with developers like you 🚀</p>
      <button
        onClick={handleGitHubLogin}
        className="btn-primary"
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;
