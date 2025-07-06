import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SmartCollabCard from '../components/smartcollab';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [showRecs, setShowRecs] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/auth/user', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          if (!data.user.profileCompleted) {
            navigate('/profile');
            return;
          }

          fetch('http://localhost:5000/users/me', {
            method: 'GET',
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((profileData) => {
              setProfile(profileData?.user);
            })
            .catch((err) => {
              console.error('Error loading profile:', err);
            });
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  // ✅ Fetch semantic (AI) collaborator suggestions
  const fetchSuggestions = async () => {
    setLoadingRecs(true);
    setShowRecs(true);
    try {
      const res = await axios.get('http://localhost:5000/users/recommend/semantic', {
        withCredentials: true,
      });
      if (res.data.success) {
        setRecommendations(res.data.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('❌ AI Suggestion fetch failed:', err);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome, {profile?.name || user?.username || "Developer"} 👋
      </h1>

      {profile && (
        <div className="text-center mb-10 text-gray-300">
          {profile.bio && <p className="mb-2"><strong>Bio:</strong> {profile.bio}</p>}
          {profile.skills && <p><strong>Skills:</strong> {profile.skills}</p>}
        </div>
      )}

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full justify-items-center mb-12">
        {/* Profile */}
        <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-400 mb-4">Update your tech stack, interests, and goals.</p>
          <Link to="/profile" className="btn-outline">Edit Profile</Link>
        </div>

        {/* Matches */}
        <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Matches</h2>
          <p className="text-gray-400 mb-4">See who matches your developer vibe!</p>
          <Link to="/matches" className="btn-outline">View Matches</Link>
        </div>

        {/* About */}
        <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-2">About DevConnect</h2>
          <p className="text-gray-400 mb-4">
            Smart developer matchmaking using GitHub, AI, and your goals.
          </p>
          <a
            href={`https://github.com/${profile?.githubUsername || user?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            View GitHub
          </a>
        </div>
      </div>

      {/* 🧠 Smart Collaborator Suggestions */}
      <div className="text-center">
        <button
          onClick={fetchSuggestions}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded mb-6"
        >
          🧠 Suggest AI-Powered Collaborators
        </button>

        {showRecs && (
          <div className="mt-6 max-w-6xl w-full">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Top AI-Powered Matches</h2>
            {loadingRecs ? (
              <p className="text-gray-400">Loading recommendations...</p>
            ) : recommendations.length === 0 ? (
              <p className="text-gray-500">No suggestions found. Try updating your profile.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((user) => (
                  <SmartCollabCard key={user._id} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
