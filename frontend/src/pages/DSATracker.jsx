import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const initialForm = {
  title: '',
  platform: '',
  difficulty: '',
  topic: '',
  status: 'Unsolved',
  notes: '',
  url: '',
};

const TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
  'Dynamic Programming', 'Recursion', 'Sorting', 'Binary Search',
  'Stack & Queue', 'Heap', 'Greedy', 'Backtracking', 'Math', 'Other'
];

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  const fetchProblems = async () => {
    try {
      const res = await api.get('/problems');
      setProblems(res.data.problems);
    } catch (err) {
      setError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/problems', form);
      setForm(initialForm);
      setShowForm(false);
      fetchProblems();
    } catch (err) {
      setError('Failed to add problem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      fetchProblems();
    } catch (err) {
      setError('Failed to delete problem');
    }
  };

  const handleToggleRevision = async (id, currentState) => {
    try {
      await api.put(`/problems/${id}/revision`);
      fetchProblems();
    } catch (err) {
      setError('Failed to update revision status');
    }
``};

  const clearFilters = () => {
    setSearch('');
    setFilterDifficulty('');
    setFilterStatus('');
    setFilterTopic('');
  };

  const difficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#16a34a';
    if (difficulty === 'Medium') return '#d97706';
    if (difficulty === 'Hard') return '#dc2626';
    return '#4a6fa5';
  };

  const statusColor = (status) => {
    if (status === 'Solved') return { bg: '#f0fdf4', text: '#16a34a' };
    if (status === 'Revisit') return { bg: '#fffbeb', text: '#d97706' };
    return { bg: '#f0f4f8', text: '#4a6fa5' };
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = filterDifficulty ? p.difficulty === filterDifficulty : true;
    const matchesStatus = filterStatus ? p.status === filterStatus : true;
    const matchesTopic = filterTopic ? p.topic === filterTopic : true;
    return matchesSearch && matchesDifficulty && matchesStatus && matchesTopic;
  });

  const isFiltered = search || filterDifficulty || filterStatus || filterTopic;

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
        <a href="/dashboard" className="text-sm font-medium" style={{ color: '#4a6fa5' }}>← Dashboard</a>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>DSA Tracker</h2>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
              {filteredProblems.length} of {problems.length} problems
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1a3a6b'}
          >
            {showForm ? 'Cancel' : '+ Add Problem'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              onFocus={e => e.target.style.borderColor = '#2e86de'}
              onBlur={e => e.target.style.borderColor = '#c5d5ea'}
            />

            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
            >
              <option value="">All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
            >
              <option value="">All Statuses</option>
              <option>Solved</option>
              <option>Unsolved</option>
              <option>Revisit</option>
            </select>

            <select
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
            >
              <option value="">All Topics</option>
              {TOPICS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs px-3 py-1 rounded-lg"
              style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Add Problem Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>Add New Problem</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Title *</label>
                  <input
                    type="text" name="title" value={form.title}
                    onChange={handleChange} required placeholder="e.g. Two Sum"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Platform</label>
                  <select name="platform" value={form.platform} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option value="">Select platform</option>
                    <option>LeetCode</option>
                    <option>CodeForces</option>
                    <option>GeeksForGeeks</option>
                    <option>HackerRank</option>
                    <option>CodeChef</option>
                    <option>Other</option>
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
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Topic</label>
                  <select name="topic" value={form.topic} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option value="">Select topic</option>
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option>Unsolved</option>
                    <option>Solved</option>
                    <option>Revisit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>URL</label>
                  <input
                    type="url" name="url" value={form.url}
                    onChange={handleChange} placeholder="https://leetcode.com/problems/..."
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Notes</label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange}
                    rows={3} placeholder="Approach, key observations..."
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-medium transition"
                  style={{ backgroundColor: '#1a3a6b' }}>
                  {submitting ? 'Adding...' : 'Add Problem'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg font-medium transition"
                  style={{ border: '1.5px solid #c5d5ea', color: '#4a6fa5' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Problems Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1.5px solid #c5d5ea' }}>
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">🧩</p>
              <p className="font-medium" style={{ color: '#1a3a6b' }}>
                {isFiltered ? 'No problems match your filters' : 'No problems tracked yet'}
              </p>
              <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
                {isFiltered ? 'Try clearing filters' : 'Click "Add Problem" to get started'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '1.5px solid #c5d5ea' }}>
                  {['Title', 'Platform', 'Difficulty', 'Topic', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#1a3a6b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p, i) => (
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
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{p.platform || '—'}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: difficultyColor(p.difficulty) }}>
                      {p.difficulty || '—'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#4a6fa5' }}>{p.topic || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: statusColor(p.status).bg, color: statusColor(p.status).text }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs px-3 py-1 rounded-lg transition"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleRevision(p.id, p.needs_revision)}
                          className="text-xs px-3 py-1 rounded-lg transition"
                          style={{
                            backgroundColor: p.needs_revision ? '#fffbeb' : '#f0f4f8',
                            color: p.needs_revision ? '#d97706' : '#4a6fa5'
                          }}
                        >
                          {p.needs_revision ? '📌 Revision' : 'Mark Revision'}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs px-3 py-1 rounded-lg transition"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </div>
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

export default DSATracker;