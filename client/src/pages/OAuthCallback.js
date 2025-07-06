import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.error('GitHub code not found in URL');
        return;
      }

      try {
        const res = await axios.post('http://localhost:5000/api/auth/github/callback', { code });

        const { token, username, name } = res.data;

        // Save to localStorage (you can later switch to Context or cookies)
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('name', name);

        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth login failed:', err);
      }
    };

    handleGitHubCallback();
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-xl text-white">Logging you in via GitHub...</h2>
    </div>
  );
};

export default OAuthCallback;
