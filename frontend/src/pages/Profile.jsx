import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfileForm({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        setProfileMsg({ text: 'Failed to load profile', type: 'error' });
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ text: '', type: '' });

    try {
      const res = await api.put('/profile', profileForm);
      // Update auth context with new name/email
      const token = localStorage.getItem('token');
      login(token, res.data.user);
      setProfileMsg({ text: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg({ text: '', type: '' });

    try {
      await api.put('/profile/change-password', passwordForm);
      setPasswordMsg({ text: 'Password changed successfully', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Failed to change password', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const msgStyle = (type) => ({
    backgroundColor: type === 'success' ? '#f0fdf4' : '#fef2f2',
    color: type === 'success' ? '#16a34a' : '#dc2626',
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm font-medium" style={{ color: '#4a6fa5' }}>← Dashboard</a>
          <button
            onClick={handleLogout}
            className="text-sm text-white px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#1a3a6b' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a3a6b' }}>My Profile</h2>

        {/* Profile Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6" style={{ border: '1.5px solid #c5d5ea' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>Personal Information</h3>

          {profileMsg.text && (
            <div className="p-3 rounded-lg mb-4 text-sm" style={msgStyle(profileMsg.type)}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Email</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="text-white px-6 py-2.5 rounded-lg font-medium transition"
              style={{ backgroundColor: '#1a3a6b' }}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>Change Password</h3>

          {passwordMsg.text && (
            <div className="p-3 rounded-lg mb-4 text-sm" style={msgStyle(passwordMsg.type)}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="text-white px-6 py-2.5 rounded-lg font-medium transition"
              style={{ backgroundColor: '#1a3a6b' }}
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;