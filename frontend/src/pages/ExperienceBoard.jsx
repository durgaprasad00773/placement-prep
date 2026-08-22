import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Heart } from 'lucide-react';
import api from '../api/axios.js';

const initialForm = {
  company: '',
  role: '',
  year: new Date().getFullYear(),
  difficulty: '',
  oa_experience: '',
  interview_rounds: '',
  tips: '',
  outcome: 'Selected',
  college: '',
  cgpa: '',
  preparation_months: '',
  offer_type: 'Internship',
  resources_used: '',
};

const outcomeColor = (outcome) => {
  if (outcome === 'Selected') return { bg: '#f0fdf4', text: '#16a34a' };
  if (outcome === 'Rejected') return { bg: '#fef2f2', text: '#dc2626' };
  return { bg: '#fffbeb', text: '#d97706' };
};

const difficultyColor = (d) => {
  if (d === 'Easy') return '#16a34a';
  if (d === 'Medium') return '#d97706';
  if (d === 'Hard') return '#dc2626';
  return '#4a6fa5';
};

const ExperienceBoard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ company: '', difficulty: '', outcome: '' });
  const [expandedId, setExpandedId] = useState(null);

  const fetchExperiences = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.company) params.append('company', filters.company);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.outcome) params.append('outcome', filters.outcome);

      const res = await api.get(`/experiences?${params.toString()}`);
      setExperiences(res.data.experiences);
    } catch (err) {
      setError('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [filters]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/experiences', form);
      setForm(initialForm);
      setShowForm(false);
      fetchExperiences();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share experience');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.put(`/experiences/${id}/upvote`);
      fetchExperiences();
    } catch (err) {
      setError('Failed to upvote');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      fetchExperiences();
    } catch (err) {
      setError('Failed to delete');
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
      <nav className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center"
        style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
        </div>
        <span onClick={() => navigate('/dashboard')} className="text-sm font-medium
          cursor-pointer" style={{ color: '#4a6fa5' }}> 
          ← Dashboard 
        </span>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>
              Experience Board
            </h2>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
              Real OA and interview experiences from placed students
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
          >
            {showForm ? 'Cancel' : '+ Share Experience'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* Add Experience Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Company *</label>
                  <input type="text" name="company" value={form.company}
                    onChange={handleChange} required placeholder="e.g. Amazon"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Role *</label>
                  <input type="text" name="role" value={form.role}
                    onChange={handleChange} required placeholder="e.g. SDE Intern"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Year *</label>
                  <input type="number" name="year" value={form.year}
                    onChange={handleChange} required min="2020" max="2030"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>College</label>
                  <input type="text" name="college" value={form.college}
                    onChange={handleChange} placeholder="e.g. NIT Warangal"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>CGPA</label>
                  <input type="text" name="cgpa" value={form.cgpa}
                    onChange={handleChange} placeholder="e.g. 8.5"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                    Preparation Time (months)
                  </label>
                  <input type="number" name="preparation_months" value={form.preparation_months}
                    onChange={handleChange} placeholder="e.g. 3" min="1" max="24"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
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
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Outcome</label>
                  <select name="outcome" value={form.outcome} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option>Selected</option>
                    <option>Rejected</option>
                    <option>Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Offer Type</label>
                  <select name="offer_type" value={form.offer_type} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>PPO</option>
                    <option>Internship + PPO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>OA Experience</label>
                <textarea name="oa_experience" value={form.oa_experience}
                  onChange={handleChange} rows={3}
                  placeholder="Describe the Online Assessment — platform, number of questions, topics, duration..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Interview Rounds</label>
                <textarea name="interview_rounds" value={form.interview_rounds}
                  onChange={handleChange} rows={3}
                  placeholder="Describe each interview round — what was asked, how many rounds, topics covered..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                  Tips for Future Students
                </label>
                <textarea name="tips" value={form.tips}
                  onChange={handleChange} rows={2}
                  placeholder="What would you tell someone preparing for this company?"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                  Resources Used
                </label>
                <textarea name="resources_used" value={form.resources_used}
                  onChange={handleChange} rows={2}
                  placeholder="e.g. Striver SDE Sheet, NeetCode 150, System Design Primer..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'} />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a3a6b' }}>
                  {submitting ? 'Sharing...' : 'Share Experience'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ border: '1.5px solid #c5d5ea', color: '#4a6fa5' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm"
          style={{ border: '1.5px solid #c5d5ea' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Search by company..."
              value={filters.company}
              onChange={e => setFilters({ ...filters, company: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              onFocus={e => e.target.style.borderColor = '#2e86de'}
              onBlur={e => e.target.style.borderColor = '#c5d5ea'} />

            <select value={filters.difficulty}
              onChange={e => setFilters({ ...filters, difficulty: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
              <option value="">All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select value={filters.outcome}
              onChange={e => setFilters({ ...filters, outcome: e.target.value })}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
              <option value="">All Outcomes</option>
              <option>Selected</option>
              <option>Rejected</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {/* Experience Cards */}
        {experiences.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium" style={{ color: '#1a3a6b' }}>No experiences shared yet</p>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
              Be the first to share your placement experience!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-xl p-5 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>

                {/* Card Header */}
                <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold" style={{ color: '#1a3a6b' }}>{exp.company}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                        {exp.role}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                        {exp.year}
                      </span>
                      {exp.difficulty && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ color: difficultyColor(exp.difficulty), backgroundColor: '#f0f4f8' }}>
                          {exp.difficulty}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: outcomeColor(exp.outcome).bg, color: outcomeColor(exp.outcome).text }}>
                        {exp.outcome}
                      </span>
                      {exp.offer_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                          {exp.offer_type}
                        </span>
                      )}
                    </div>

                    {/* Meta info row */}
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {exp.college && (
                        <span className="text-xs" style={{ color: '#4a6fa5' }}>
                           {exp.college}
                        </span>
                      )}
                      {exp.cgpa && (
                        <span className="text-xs" style={{ color: '#4a6fa5' }}>
                          • CGPA: {exp.cgpa}
                        </span>
                      )}
                      {exp.preparation_months && (
                        <span className="text-xs" style={{ color: '#4a6fa5' }}>
                          • {exp.preparation_months} months prep
                        </span>
                      )}
                    </div>

                    <p className="text-xs mt-1" style={{ color: '#c5d5ea' }}>
                      Shared by {exp.author_name} • {new Date(exp.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Upvote */}
                  <button
  onClick={() => handleUpvote(exp.id)}
  className="group inline-flex items-center gap-1.5 text-slate-500"
>
  <Heart
    size={23}
    strokeWidth={2}
    className={`transition-all duration-200 
      group-hover:scale-110 group-active:scale-90
      ${exp.has_upvoted ? 'text-red-500' : 'text-slate-500 group-hover:text-red-500'}`}
    fill={exp.has_upvoted ? 'currentColor' : 'none'}
  />

  <span
    className={`text-sm font-medium ${
      exp.has_upvoted ? 'text-red-500' : 'text-slate-600'
    }`}
  >
    {exp.upvotes}
  </span>
</button>
                </div>

                {/* Expandable Content */}
                <div>
                  {exp.oa_experience && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#1a3a6b' }}>
                        OA Experience
                      </p>
                      <p className="text-sm" style={{ color: '#4a6fa5' }}>
                        {expandedId === exp.id
                          ? exp.oa_experience
                          : exp.oa_experience.length > 150
                            ? exp.oa_experience.substring(0, 150) + '...'
                            : exp.oa_experience}
                      </p>
                    </div>
                  )}

                  {exp.interview_rounds && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#1a3a6b' }}>
                        Interview Rounds
                      </p>
                      <p className="text-sm" style={{ color: '#4a6fa5' }}>
                        {expandedId === exp.id
                          ? exp.interview_rounds
                          : exp.interview_rounds.length > 150
                            ? exp.interview_rounds.substring(0, 150) + '...'
                            : exp.interview_rounds}
                      </p>
                    </div>
                  )}

                  {expandedId === exp.id && (
                    <>
                      {exp.tips && (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#16a34a' }}>
                            💡 Tips
                          </p>
                          <p className="text-sm" style={{ color: '#4a6fa5' }}>{exp.tips}</p>
                        </div>
                      )}

                      {exp.resources_used && (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#2e86de' }}>
                            📚 Resources Used
                          </p>
                          <p className="text-sm" style={{ color: '#4a6fa5' }}>{exp.resources_used}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      className="text-xs font-medium"
                      style={{ color: '#2e86de' }}>
                      {expandedId === exp.id ? 'Show less ↑' : 'Read more ↓'}
                    </button>

                    {exp.user_id === user?.id && (
                      <button onClick={() => handleDelete(exp.id)}
                        className="text-xs px-3 py-1 rounded-lg"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceBoard;