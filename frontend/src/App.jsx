import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Inbox from './pages/Inbox';
import SendMessage from './pages/SendMessage';
import { setAuthToken } from './api/api';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // ✅ Restore JWT token into axios on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthToken(null);
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
          <div className="space-x-4">
            <Link to="/">Home</Link>
            {user && <Link to="/inbox">Inbox</Link>}
            {user && <Link to="/send">Send</Link>}
          </div>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="mr-2">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={< Home/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/inbox" element={user ? <Inbox user={user} /> : <h2>Please login</h2>} />
            <Route path="/send" element={user ? <SendMessage user={user} /> : <h2>Please login</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
