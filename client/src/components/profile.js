import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    githubUsername: '',
    techStack: '',
    interests: '',
    goals: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch logged-in user to pre-fill GitHub username
  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/user', { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setFormData((prev) => ({
            ...prev,
            githubUsername: res.data.user.username || '',
          }));
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('User fetch error:', err);
        navigate('/');
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // ✅ Convert strings to arrays
    const techArray = formData.techStack.split(',').map(item => item.trim()).filter(Boolean);
    const interestArray = formData.interests.split(',').map(item => item.trim()).filter(Boolean);
    const goalArray = formData.goals.split(',').map(item => item.trim()).filter(Boolean);

    try {
      const res = await axios.post(
        'http://localhost:5000/users/me',
        {
          githubUsername: formData.githubUsername,
          techStack: techArray,
          interests: interestArray,
          goals: goalArray,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage('✅ Profile created successfully!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage('⚠️ Failed to create profile.');
      }
    } catch (err) {
      console.error('Profile error:', err);
      setMessage('❌ Error submitting profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-white">GitHub Username</label>
          <input
            type="text"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-white">Tech Stack (comma separated)</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g. React.js, Node.js, MongoDB"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-white">Interests</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g. AI, Web3, Open Source"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-white">Goals</label>
          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            placeholder="e.g. Looking to build a full-stack AI app"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {message && <p className="text-center mt-2 text-white">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
