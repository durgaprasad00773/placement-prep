import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const TAGS = ['DSA', 'System Design', 'OS', 'DBMS', 'Networks', 'OOP', 'HR', 'Other'];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', tag: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data.notes);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setForm({ title: note.title, content: note.content || '', tag: note.tag || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditNote(null);
    setForm({ title: '', content: '', tag: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editNote) {
        await api.put(`/notes/${editNote.id}`, form);
      } else {
        await api.post('/notes', form);
      }
      handleCancel();
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const tagColor = (tag) => {
    const colors = {
      'DSA': { bg: '#eff6ff', text: '#2e86de' },
      'System Design': { bg: '#f0fdf4', text: '#16a34a' },
      'OS': { bg: '#fdf4ff', text: '#9333ea' },
      'DBMS': { bg: '#fff7ed', text: '#ea580c' },
      'Networks': { bg: '#f0f9ff', text: '#0284c7' },
      'OOP': { bg: '#fefce8', text: '#ca8a04' },
      'HR': { bg: '#fff1f2', text: '#e11d48' },
      'Other': { bg: '#f8fafc', text: '#64748b' },
    };
    return colors[tag] || { bg: '#f0f4f8', text: '#4a6fa5' };
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.tag && n.tag.toLowerCase().includes(search.toLowerCase()))
  );

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
            <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>Notes</h2>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>{notes.length} notes saved</p>
          </div>
          <button
            onClick={() => { setEditNote(null); setForm({ title: '', content: '', tag: '' }); setShowForm(!showForm); }}
            className="text-white px-4 py-2 rounded-lg font-medium transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.target.style.backgroundColor = '#1a3a6b'}
          >
            {showForm ? 'Cancel' : '+ Add Note'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes by title or tag..."
            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b', backgroundColor: 'white' }}
            onFocus={e => e.target.style.borderColor = '#2e86de'}
            onBlur={e => e.target.style.borderColor = '#c5d5ea'}
          />
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a3a6b' }}>
              {editNote ? 'Edit Note' : 'Add New Note'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Title *</label>
                <input
                  type="text" name="title" value={form.title}
                  onChange={handleChange} required placeholder="Note title"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Tag</label>
                <select name="tag" value={form.tag} onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}>
                  <option value="">Select tag</option>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>Content</label>
                <textarea
                  name="content" value={form.content} onChange={handleChange}
                  rows={6} placeholder="Write your notes here..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                  onFocus={e => e.target.style.borderColor = '#2e86de'}
                  onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#1a3a6b' }}>
                  {submitting ? 'Saving...' : editNote ? 'Update Note' : 'Add Note'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ border: '1.5px solid #c5d5ea', color: '#4a6fa5' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm" style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-3">📒</p>
            <p className="font-medium" style={{ color: '#1a3a6b' }}>
              {search ? 'No notes match your search' : 'No notes yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
              {search ? 'Try a different search term' : 'Click "+ Add Note" to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white rounded-xl p-5 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: '#1a3a6b' }}>{note.title}</h3>
                  {note.tag && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0"
                      style={{ backgroundColor: tagColor(note.tag).bg, color: tagColor(note.tag).text }}>
                      {note.tag}
                    </span>
                  )}
                </div>

                {note.content && (
                  <p className="text-xs mt-2 line-clamp-4" style={{ color: '#4a6fa5' }}>
                    {note.content}
                  </p>
                )}

                <p className="text-xs mt-3" style={{ color: '#c5d5ea' }}>
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(note)}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note.id)}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;