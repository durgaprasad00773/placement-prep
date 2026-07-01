import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', form);
      const loginRes = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(loginRes.data.token, loginRes.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12" style={{ backgroundColor: '#1a3a6b' }}>
        <h1 className="text-4xl font-bold text-white mb-4">PrepTrack</h1>
        <p className="text-center text-lg" style={{ color: '#c5d5ea' }}>
          Your all-in-one platform for placement preparation
        </p>
        <div className="mt-10 space-y-4 w-full max-w-xs">
          {['DSA Tracker', 'OA Manager', 'AI Mock Interviews', 'Resume Analyzer'].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2e86de' }}></div>
              <span className="text-white">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
          {/* Logo on mobile */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
            Create Account
          </h2>
          <p className="text-sm mb-6" style={{ color: '#4a6fa5' }}>
            Start your placement preparation today
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                onFocus={e => e.target.style.borderColor = '#2e86de'}
                onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2.5 rounded-lg font-semibold transition"
              style={{ backgroundColor: loading ? '#4a6fa5' : '#1a3a6b' }}
              onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#142d54' }}
              onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = '#1a3a6b' }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: '#4a6fa5' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: '#2e86de' }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;