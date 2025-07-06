import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/users', {
        withCredentials: true,
      });
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${id}`, {
        withCredentials: true,
      });
      setMessage('✅ User deleted');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🛠️ Admin Dashboard</h2>
      {message && <p className="text-green-400 mb-4">{message}</p>}
      <table className="w-full table-auto border border-gray-700">
        <thead>
          <tr className="bg-gray-900">
            <th className="p-2">Username</th>
            <th className="p-2">Tech Stack</th>
            <th className="p-2">Interests</th>
            <th className="p-2">Completed</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-gray-700">
              <td className="p-2">
                {u.githubUsername || u.username}
                {u.isAdmin && (
                  <span className="ml-2 text-yellow-400 font-semibold text-sm">
                    🛡️ Admin
                  </span>
                )}
              </td>
              <td className="p-2">{u.techStack?.join(', ') || '—'}</td>
              <td className="p-2">{u.interests || '—'}</td>
              <td className="p-2 text-center">{u.profileCompleted ? '✅' : '❌'}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(u._id)}
                  className="bg-red-600 px-3 py-1 text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={u.isAdmin}
                  title={u.isAdmin ? 'Cannot delete admin user' : 'Delete user'}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
