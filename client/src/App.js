import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Matches from './pages/Matches';
import Navbar from './components/navbar';
import Profile from'./components/profile';
import Dashboard from './pages/Dashboard';
import SetupProfile from'./pages/SetupProfile';
import OAuthCallback from './pages/OAuthCallback';
import AdminDashboard from './pages/admindashboard';
import Chatpage from './pages/chatpage';
/*import ProtectedRoute from './components/ProtectedRoute';*/
import NotFound from './pages/NotFound';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/matches" element={/*<ProtectedRoute>*/<Matches />/*</ProtectedRoute>*/} />
            <Route path="/profile" element={/*<ProtectedRoute>*/<Profile />/*</ProtectedRoute>*/} />
            <Route path="/dashboard" element={/*<ProtectedRoute>*/<Dashboard />/*</ProtectedRoute>*/} />
            <Route path="/setup-profile" element={/*<ProtectedRoute>*/<SetupProfile />/*</ProtectedRoute>*/} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/chat" element={<Chatpage />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFound />} /> {/* Must be last */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
