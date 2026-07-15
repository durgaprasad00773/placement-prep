import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', version: '', notes: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingId, setViewingId] = useState(null);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data.resumes);
    } catch (err) {
      setError('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('version', form.version);
      formData.append('notes', form.notes);
      formData.append('resume', file);

      await api.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setForm({ title: '', version: '', notes: '' });
      setFile(null);
      setShowForm(false);
      setSuccess('Resume uploaded successfully');
      fetchResumes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await api.put(`/resumes/${id}/active`);
      fetchResumes();
    } catch (err) {
      setError('Failed to set active resume');
    }
  };

  const handleViewResume = async (id) => {
  setViewingId(id);
  setError('');
  try {
    const res = await api.get(`/resumes/${id}/file`);
    window.open(res.data.url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load resume file');
  } finally {
    setViewingId(null);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
    } catch (err) {
      setError('Failed to delete resume');
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

      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>Resume Manager</h2>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} stored</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1a3a6b'}
          >
            {showForm ? 'Cancel' : '+ Upload Resume'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>
        )}

        {/* Upload Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>Upload New Resume</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Title *</label>
                <input
                  type="text" name="title" value={form.title}
                  onChange={handleChange} required placeholder="e.g. Amazon SDE Intern Resume"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Version</label>
                <input
                  type="text" name="version" value={form.version}
                  onChange={handleChange} placeholder="e.g. v1, v2, July 2026"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Notes</label>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange}
                  rows={2} placeholder="What changed in this version..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>PDF File *</label>
                <input
                  type="file" accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                />
                {file && (
                  <p className="text-xs mt-1" style={{ color: '#16a34a' }}>
                    ✓ {file.name} selected
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a3a6b' }}>
                  {submitting ? 'Uploading...' : 'Upload Resume'}
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

        {/* Resumes List */}
        {resumes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-3">📄</p>
            <p className="font-medium" style={{ color: '#1a3a6b' }}>No resumes uploaded yet</p>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>Click "+ Upload Resume" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-xl p-5 shadow-sm"
                style={{ border: `1.5px solid ${resume.is_active ? '#2e86de' : '#c5d5ea'}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold" style={{ color: '#1a3a6b' }}>{resume.title}</h3>
                      {resume.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                          Active
                        </span>
                      )}
                      {resume.version && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                          {resume.version}
                        </span>
                      )}
                    </div>
                    {resume.notes && (
                      <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{resume.notes}</p>
                    )}
                    <p className="text-xs mt-2" style={{ color: '#c5d5ea' }}>
                      Uploaded {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleViewResume(resume.id)}
                      disabled={viewingId === resume.id}
                      className="text-xs px-3 py-1 rounded-lg font-medium"
                      style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                      {viewingId === resume.id ? 'Loading...' : 'View PDF'}
                  </button>
                    {!resume.is_active && (
                      <button onClick={() => handleSetActive(resume.id)}
                        className="text-xs px-3 py-1 rounded-lg font-medium"
                        style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        Set Active
                      </button>
                    )}
                    <button onClick={() => handleDelete(resume.id)}
                      className="text-xs px-3 py-1 rounded-lg"
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                      Delete
                    </button>
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

export default ResumeManager;