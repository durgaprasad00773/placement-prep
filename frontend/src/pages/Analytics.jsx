import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';

const COLORS = ['#1a3a6b', '#2e86de', '#4a6fa5', '#c5d5ea', '#142d54'];

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
    <p className="text-sm font-medium" style={{ color: '#4a6fa5' }}>{label}</p>
    <p className="text-3xl font-bold mt-1" style={{ color: color || '#1a3a6b' }}>{value}</p>
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setData(res.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <p style={{ color: '#1a3a6b' }}>Loading analytics...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <p style={{ color: '#dc2626' }}>{error}</p>
    </div>
  );

  const { dsa, oa, solvedOverTime } = data;

  // Pie chart data for DSA status
  const dsaStatusData = [
    { name: 'Solved', value: parseInt(dsa.solved) },
    { name: 'Unsolved', value: parseInt(dsa.unsolved) },
    { name: 'Revisit', value: parseInt(dsa.revisit) },
  ].filter(d => d.value > 0);

  // Pie chart data for difficulty
  const dsaDifficultyData = [
    { name: 'Easy', value: parseInt(dsa.easy) },
    { name: 'Medium', value: parseInt(dsa.medium) },
    { name: 'Hard', value: parseInt(dsa.hard) },
  ].filter(d => d.value > 0);

  // OA status pie
  const oaStatusData = [
    { name: 'Cleared', value: parseInt(oa.cleared) },
    { name: 'Failed', value: parseInt(oa.failed) },
    { name: 'Pending', value: parseInt(oa.pending) },
    { name: 'No Response', value: parseInt(oa.no_response) },
  ].filter(d => d.value > 0);

  const solveRate = dsa.total > 0
    ? Math.round((dsa.solved / dsa.total) * 100)
    : 0;

  const oaClearRate = oa.total > 0
    ? Math.round((oa.cleared / oa.total) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>
        <span onClick={() => navigate('/dashboard')} className="text-sm font-medium cursor-pointer" style={{ color: '#4a6fa5' }}>← Dashboard</span>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>Analytics</h2>
        <p className="text-sm mb-8" style={{ color: '#4a6fa5' }}>Your placement prep progress at a glance</p>

        {/* DSA Stats Cards */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>DSA Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Problems" value={dsa.total} />
          <StatCard label="Solved" value={dsa.solved} color="#16a34a" />
          <StatCard label="Revisit" value={dsa.revisit} color="#d97706" />
          <StatCard label="Solve Rate" value={`${solveRate}%`} color="#2e86de" />
        </div>

        {/* DSA Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* DSA Status Pie */}
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>Problem Status</h4>
            {dsaStatusData.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#4a6fa5' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dsaStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {dsaStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* DSA by Topic Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>Problems by Topic</h4>
            {dsa.byTopic.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#4a6fa5' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dsa.byTopic}>
                  <XAxis dataKey="topic" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1a3a6b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Solved Over Time */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8" style={{ border: '1.5px solid #c5d5ea' }}>
          <h4 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>Problems Solved (Last 7 Days)</h4>
          {solvedOverTime.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4a6fa5' }}>No problems solved in the last 7 days</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={solvedOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d5ea" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2e86de" strokeWidth={2} dot={{ fill: '#1a3a6b' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* OA Stats */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>OA Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total OAs" value={oa.total} />
          <StatCard label="Cleared" value={oa.cleared} color="#16a34a" />
          <StatCard label="Failed" value={oa.failed} color="#dc2626" />
          <StatCard label="Clear Rate" value={`${oaClearRate}%`} color="#2e86de" />
        </div>

        {/* OA Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* OA Status Pie */}
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>OA Status Distribution</h4>
            {oaStatusData.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#4a6fa5' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={oaStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {oaStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* OA by Company */}
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>OAs by Company (Top 5)</h4>
            {oa.byCompany.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#4a6fa5' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={oa.byCompany}>
                  <XAxis dataKey="company" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2e86de" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;