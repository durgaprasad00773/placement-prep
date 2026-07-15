import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const initialForm = {
  company: '',
  role: '',
  oa_date: '',
  platform: '',
  status: 'Pending',
  difficulty: '',
  num_questions: '',
  duration_mins: '',
  topics: [],
  notes: '',
};

const TOPIC_OPTIONS = [
  'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
  'Dynamic Programming', 'Recursion', 'Sorting', 'Binary Search',
  'Stack & Queue', 'Heap', 'Greedy', 'Backtracking', 'Math'
];

const statusColor = (status) => {
  if (status === 'Cleared') return { bg: '#f0fdf4', text: '#16a34a' };
  if (status === 'Failed') return { bg: '#fef2f2', text: '#dc2626' };
  if (status === 'No Response') return { bg: '#f8fafc', text: '#64748b' };
  return { bg: '#fffbeb', text: '#d97706' };
};

const difficultyColor = (d) => {
  if (d === 'Easy') return '#16a34a';
  if (d === 'Medium') return '#d97706';
  if (d === 'Hard') return '#dc2626';
  return '#4a6fa5';
};

const OATracker = () => {
  const [oas, setOAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOAs = async () => {
    try {
      const res = await api.get('/oa');
      setOAs(res.data.oas);
    } catch (err) {
      setError('Failed to fetch OA records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOAs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTopicToggle = (topic) => {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/oa', {
        ...form,
        num_questions: form.num_questions ? parseInt(form.num_questions) : null,
        duration_mins: form.duration_mins ? parseInt(form.duration_mins) : null,
      });
      setForm(initialForm);
      setShowForm(false);
      fetchOAs();
    } catch (err) {
      setError('Failed to add OA record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this OA record?')) return;
    try {
      await api.delete(`/oa/${id}`);
      fetchOAs();
    } catch (err) {
      setError('Failed to delete OA record');
    }
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
        <span onClick={() => navigate('/dashboard')} className="text-sm font-medium cursor-pointer" style={{ color: '#4a6fa5' }}>← Dashboard</span>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>OA Tracker</h2>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{oas.length} assessments tracked</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1a3a6b'}
          >
            {showForm ? 'Cancel' : '+ Add OA'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* Add OA Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>Add OA Record</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Company *</label>
                  <input
                    type="text" name="company" value={form.company}
                    onChange={handleChange} required placeholder="e.g. Amazon"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Role</label>
                  <input
                    type="text" name="role" value={form.role}
                    onChange={handleChange} placeholder="e.g. SDE Intern"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>OA Date</label>
                  <input
                    type="date" name="oa_date" value={form.oa_date}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Platform</label>
                  <select name="platform" value={form.platform} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option value="">Select platform</option>
                    <option>HackerRank</option>
                    <option>HackerEarth</option>
                    <option>Codility</option>
                    <option>CoderPad</option>
                    <option>Custom Portal</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option>Pending</option>
                    <option>Cleared</option>
                    <option>Failed</option>
                    <option>No Response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option value="">Select difficulty</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>No. of Questions</label>
                  <input
                    type="number" name="num_questions" value={form.num_questions}
                    onChange={handleChange} placeholder="e.g. 3" min="1"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Duration (mins)</label>
                  <input
                    type="number" name="duration_mins" value={form.duration_mins}
                    onChange={handleChange} placeholder="e.g. 90" min="1"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                {/* Topics Multi-select */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1a3a6b' }}>Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_OPTIONS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleTopicToggle(topic)}
                        className="px-3 py-1 rounded-full text-xs font-medium transition"
                        style={{
                          backgroundColor: form.topics.includes(topic) ? '#1a3a6b' : '#f0f4f8',
                          color: form.topics.includes(topic) ? 'white' : '#4a6fa5',
                          border: '1.5px solid #c5d5ea'
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Notes</label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange}
                    rows={3} placeholder="Key observations, what went wrong..."
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit" disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a3a6b' }}
                >
                  {submitting ? 'Adding...' : 'Add Record'}
                </button>
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ border: '1.5px solid #c5d5ea', color: '#4a6fa5' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* OA Records Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1.5px solid #c5d5ea' }}>
          {oas.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="font-medium" style={{ color: '#1a3a6b' }}>No OA records yet</p>
              <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>Click "+ Add OA" to get started</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '1.5px solid #c5d5ea' }}>
                  {['Company', 'Role', 'Date', 'Platform', 'Difficulty', 'Questions', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#1a3a6b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {oas.map((oa, i) => (
                  <tr key={oa.id} style={{ borderBottom: '1px solid #c5d5ea', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a3a6b' }}>{oa.company}</td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{oa.role || '—'}</td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{oa.oa_date ? new Date(oa.oa_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{oa.platform || '—'}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: difficultyColor(oa.difficulty) }}>{oa.difficulty || '—'}</td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{oa.num_questions || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: statusColor(oa.status).bg, color: statusColor(oa.status).text }}>
                        {oa.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(oa.id)}
                        className="text-xs px-3 py-1 rounded-lg"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OATracker;