import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
  { label: 'DSA Tracker', description: 'Track your problem solving progress', icon:<img src="/dsa_logo.png" alt="Resume" className="w-8 h-8 object-contain" />, path: '/dsa-tracker' },
  { label: 'OA Records', description: 'Manage online assessments', icon: '📝', path: '/oa-tracker' },
  { label: 'Notes', description: 'Store your study notes', icon: '📒', path: '/notes' },
  { label: 'Resume Manager', description: 'Store and manage resume versions', icon: <img src="resume_logo.png" alt="Resume" className="w-8 h-8 object-contain" />, path: '/resume-manager' },
  { label: 'Analytics', description: 'View your prep progress and stats', icon: '📊', path: '/analytics' },
  { label: 'Revision List', description: 'Problems marked for revision', icon: '📌', path: '/revision-list' },
];

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer font-bold text-sm text-white transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
            title={user?.name}
          >
            {getInitials(user?.name)}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1a3a6b'}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
          Welcome back, {user?.name}
        </h2>
        <p className="text-sm mb-8" style={{ color: '#4a6fa5' }}>
          Your placement prep dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.label}
              onClick={() => navigate(feature.path)}
              className="bg-white rounded-xl p-6 shadow-sm cursor-pointer transition"
              style={{ border: '1.5px solid #c5d5ea' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2e86de'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#c5d5ea'}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <p className="font-semibold" style={{ color: '#1a3a6b' }}>{feature.label}</p>
              <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;