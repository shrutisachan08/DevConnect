import React from 'react';

const SmartCollabCard = ({ user }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-bold text-purple-400">{user.username}</h3>
      <p className="text-sm text-gray-400">@{user.githubUsername}</p>

      <div className="mt-2">
        <p className="text-sm"><strong>Tech Stack:</strong> {user.techStack?.join(', ')}</p>
        <p className="text-sm"><strong>Interests:</strong> {user.interests}</p>
        <p className="text-sm"><strong>Goals:</strong> {user.goals}</p>
      </div>

      <div className="mt-2 text-green-400 text-sm">
        🔗 Matched Score: {user.score}
      </div>
    </div>
  );
};

export default SmartCollabCard;
