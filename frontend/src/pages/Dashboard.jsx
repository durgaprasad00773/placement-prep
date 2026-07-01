import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: '#4a6fa5' }}>
            {user?.name}
          </span>
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

      {/* Content */}
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
          Welcome back, {user?.name} 👋
        </h2>
        <p className="text-sm mb-8" style={{ color: '#4a6fa5' }}>
          Your placement prep dashboard
        </p>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'DSA Problems', value: '0 solved', icon: '🧩' },
            { label: 'OA Records', value: '0 tracked', icon: '📝' },
            { label: 'Notes', value: '0 saved', icon: '📒' },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="text-sm font-medium" style={{ color: '#4a6fa5' }}>{card.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#1a3a6b' }}>{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;