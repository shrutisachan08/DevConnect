import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MatchCard from '../components/matchcard';
import LoadingSpinner from '../components/LoadingSpinner';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');

  // ✅ Fetch filtered matches
  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/match', {
        withCredentials: true,
        params: {
          tech: techFilter,
          goal: goalFilter,
        }
      });

      if (res.data.success) {
        setMatches(res.data.matches);
        setErrorMsg('');
      } else {
        setMatches([]);
        setErrorMsg('No matches found.');
      }
    } catch (err) {
      console.error('❌ Error fetching matches:', err);
      setErrorMsg('Failed to fetch matches.');
    } finally {
      setLoading(false);
    }
  }, [techFilter, goalFilter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🎯 Developer Matches</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 justify-center flex-wrap">
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 px-4 py-2 rounded"
        >
          <option value="">All Tech</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>

        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 px-4 py-2 rounded"
        >
          <option value="">All Goals</option>
          <option value="Internship">Internship</option>
          <option value="Open Source">Open Source</option>
          <option value="Freelance">Freelance</option>
          <option value="Hackathon">Hackathon</option>
        </select>

        <button
          onClick={fetchMatches}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : errorMsg ? (
        <p className="text-center text-red-400">{errorMsg}</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-400">
          No matches found. Try updating your profile.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((user, index) => (
            <MatchCard key={user._id || user.userId || index} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
