import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const RevisionList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRevisionList = async () => {
    try {
      const res = await api.get('/problems/revision/list');
      setProblems(res.data.problems);
    } catch (err) {
      setError('Failed to fetch revision list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisionList();
  }, []);

  const handleRemoveRevision = async (id) => {
    try {
      await api.put(`/problems/${id}/revision`);
      fetchRevisionList();
    } catch (err) {
      setError('Failed to update revision status');
    }
  };

  const difficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#16a34a';
    if (difficulty === 'Medium') return '#d97706';
    if (difficulty === 'Hard') return '#dc2626';
    return '#4a6fa5';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <p style={{ color: '#1a3a6b' }}>Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>
        <div className="flex gap-4">
          <span onClick={() => navigate('/dsa-tracker')} className="text-sm font-medium cursor-pointer" style={{ color: '#4a6fa5' }}>← DSA Tracker</span>
          <span onClick={() => navigate('/dashboard')} className="text-sm font-medium cursor-pointer" style={{ color: '#4a6fa5' }}>Dashboard</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>Revision List</h2>
          <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
            {problems.length} problem{problems.length !== 1 ? 's' : ''} marked for revision
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {problems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-3">✅</p>
            <p className="font-medium" style={{ color: '#1a3a6b' }}>No problems marked for revision</p>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
              Go to DSA Tracker and mark problems you want to revisit
            </p>
            <button
              onClick={() => navigate('/dsa-tracker')}
              className="mt-4 text-white px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#1a3a6b' }}
            >
              Go to DSA Tracker
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1.5px solid #c5d5ea' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '1.5px solid #c5d5ea' }}>
                  {['Title', 'Topic', 'Difficulty', 'Revised', 'Times', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#1a3a6b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problems.map((p, i) => (
                  <tr key={p.id}
                    style={{ borderBottom: '1px solid #c5d5ea', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a3a6b' }}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noreferrer"
                          className="hover:underline" style={{ color: '#2e86de' }}>
                          {p.title}
                        </a>
                      ) : p.title}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{p.topic || '—'}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: difficultyColor(p.difficulty) }}>
                      {p.difficulty || '—'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>
                      {p.last_revised_at
                        ? new Date(p.last_revised_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                        {p.revision_count}x
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveRevision(p.id)}
                        className="text-xs px-3 py-1 rounded-lg"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionList;