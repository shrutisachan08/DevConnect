import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    githubUsername: '',
    bio: '',
    skills: ''
  });

  const [loading, setLoading] = useState(true);

  // Fetch user from backend to pre-fill GitHub username
  useEffect(() => {
    fetch('http://localhost:5000/auth/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setFormData(prev => ({
            ...prev,
            githubUsername: data.user.username,
            name: data.user.displayName || '',
          }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      githubUsername: formData.githubUsername,
      name: formData.name,
      bio: formData.bio,
      techStack: formData.skills.split(',').map(skill => skill.trim())
    };

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert('Profile saved successfully!');
        navigate('/dashboard');
      } else {
        alert('Profile save failed.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Set Up Your Developer Profile</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />

        <input
          type="text"
          name="githubUsername"
          placeholder="GitHub Username"
          value={formData.githubUsername}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          required
        />

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          rows={3}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (e.g., React, Python, AI)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default SetupProfile;
