// components/MatchCard.js
import React from 'react';

const MatchCard = ({ user }) => {
  const githubLink = `https://github.com/${user.githubUsername || user.username || ''}`;
  const displayName = user.githubUsername || user.username || 'Unnamed Developer';

  return (
    <a
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:shadow-2xl transition duration-300"
    >
      <div className="bg-gray-800 p-4 rounded-xl shadow text-white max-w-xs">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || "https://avatars.githubusercontent.com/u/0?v=4"}
            alt="GitHub Avatar"
            className="w-12 h-12 rounded-full border border-gray-500"
          />
          <div className="truncate">
            <h3 className="text-lg font-bold truncate">{displayName}</h3>

            {user.score !== undefined && (
              <div className="mt-1">
                <div className="bg-gray-700 rounded-full h-2.5 w-full">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{ width: `${user.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 text-right mt-1">
                  Match Score: {user.score}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm space-y-1">
          <p className="break-words"><strong>Tech Stack:</strong> {user.techStack?.join(', ') || 'N/A'}</p>
          <p className="truncate"><strong>Interests:</strong> {user.interests || 'Not specified'}</p>
          <p className="truncate"><strong>Goals:</strong> {user.goals || 'No goals added'}</p>
          <p className="truncate"><strong>Status:</strong> {user.status || 'No status set'}</p>
        </div>

        <div className="mt-3 text-center">
          <span className="text-blue-400 hover:underline text-sm">
            🔗 View GitHub Profile
          </span>
        </div>
      </div>
    </a>
  );
};

export default MatchCard;
