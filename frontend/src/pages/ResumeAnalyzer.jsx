import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Goldman Sachs', 'Morgan Stanley', 'Uber', 'Atlassian',
  'Oracle', 'Flipkart', 'Walmart', 'Adobe', 'Salesforce',
  'Infosys', 'TCS', 'Wipro', 'Other'
];

const ROLES = [
  'SDE Intern', 'SDE-1', 'SDE-2', 'Frontend Engineer',
  'Backend Engineer', 'Full Stack Engineer', 'Data Engineer',
  'ML Engineer', 'DevOps Engineer', 'Product Engineer'
];

const ScoreCircle = ({ score, label, color }) => (
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl text-white"
      style={{ backgroundColor: color }}>
      {score}
    </div>
    <p className="text-xs mt-2 text-center font-medium" style={{ color: '#4a6fa5' }}>{label}</p>
  </div>
);

const ResumeAnalyzer = () => {
  const [targetRole, setTargetRole] = useState('SDE Intern');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/ai/analyze-resume', {
        target_role: targetRole,
        target_company: targetCompany,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return '#16a34a';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center"
        style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>
        <span onClick={() => navigate('/dashboard')}
          className="text-sm font-medium cursor-pointer"
          style={{ color: '#4a6fa5' }}>
          ← Dashboard
        </span>
      </nav>

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>AI Resume Analyzer</h2>
        <p className="text-sm mb-8" style={{ color: '#4a6fa5' }}>
          Get AI-powered feedback on your resume tailored to your target role and company.
        </p>

        {/* Config Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6"
          style={{ border: '1.5px solid #c5d5ea' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
            Select Target Role & Company
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              >
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Target Company
              </label>
              <select
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              >
                {COMPANIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="text-white px-6 py-2.5 rounded-lg font-medium transition"
              style={{ backgroundColor: loading ? '#4a6fa5' : '#1a3a6b' }}
            >
              {loading ? '🤖 Analyzing...' : '🤖 Analyze Resume'}
            </button>
            <p className="text-xs" style={{ color: '#4a6fa5' }}>
              Uses your active resume from Resume Manager
            </p>
          </div>

          {!result && !loading && (
            <div className="mt-4 p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
              💡 Make sure you have an active resume set in{' '}
              <span
                onClick={() => navigate('/resume-manager')}
                className="font-semibold cursor-pointer underline"
              >
                Resume Manager
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {loading && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-4">🤖</p>
            <p className="font-semibold" style={{ color: '#1a3a6b' }}>
              Analyzing your resume...
            </p>
            <p className="text-sm mt-2" style={{ color: '#4a6fa5' }}>
              This takes 10-15 seconds
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6">

            {/* Score Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-6" style={{ color: '#1a3a6b' }}>
                Score Overview — {result.target.role} at {result.target.company}
              </h3>
              <div className="flex justify-around flex-wrap gap-6">
                <ScoreCircle
                  score={result.analysis.overall_score}
                  label="Overall Score"
                  color={scoreColor(result.analysis.overall_score)}
                />
                <ScoreCircle
                  score={result.analysis.ats_score}
                  label="ATS Score"
                  color={scoreColor(result.analysis.ats_score)}
                />
                <ScoreCircle
                  score={result.analysis.company_fit.score}
                  label={`${result.target.company} Fit`}
                  color={scoreColor(result.analysis.company_fit.score)}
                />
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f0f4f8' }}>
                <p className="text-sm" style={{ color: '#1a3a6b' }}>{result.analysis.summary}</p>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>✅ Strengths</h3>
                <ul className="space-y-2">
                  {result.analysis.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: '#16a34a' }}>•</span>
                      <span style={{ color: '#4a6fa5' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {result.analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: '#dc2626' }}>•</span>
                      <span style={{ color: '#4a6fa5' }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                💡 Detailed Suggestions
              </h3>
              <div className="space-y-4">
                {result.analysis.suggestions.map((s, i) => (
                  <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#f0f4f8' }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#1a3a6b' }}>
                      {s.category}
                    </p>
                    <p className="text-xs mb-2" style={{ color: '#dc2626' }}>
                      ❌ {s.issue}
                    </p>
                    <p className="text-xs" style={{ color: '#16a34a' }}>
                      ✅ {s.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Fit */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                🏢 {result.target.company} Fit Analysis
              </h3>
              <p className="text-sm mb-3" style={{ color: '#4a6fa5' }}>
                {result.analysis.company_fit.reason}
              </p>
              <p className="text-sm font-medium mb-2" style={{ color: '#1a3a6b' }}>
                What they look for:
              </p>
              <p className="text-sm mb-4" style={{ color: '#4a6fa5' }}>
                {result.analysis.company_fit.what_they_look_for}
              </p>
              <p className="text-sm font-medium mb-2" style={{ color: '#1a3a6b' }}>Gaps:</p>
              <ul className="space-y-1">
                {result.analysis.company_fit.gaps.map((g, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span style={{ color: '#d97706' }}>•</span>
                    <span style={{ color: '#4a6fa5' }}>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                🤖 ATS Optimization Tips
              </h3>
              <ul className="space-y-2">
                {result.analysis.ats_tips.map((t, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span style={{ color: '#2e86de' }}>•</span>
                    <span style={{ color: '#4a6fa5' }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                🎯 Top Action Items
              </h3>
              <div className="space-y-3">
                {result.analysis.action_items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: '#1a3a6b' }}>
                      {i + 1}
                    </div>
                    <p className="text-sm" style={{ color: '#4a6fa5' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Topics */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                📚 Topics to Prepare for Interview
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.analysis.interview_topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Sections */}
            {result.analysis.missing_sections.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm"
                style={{ border: '1.5px solid #fee2e2' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#dc2626' }}>
                  ❌ Missing Sections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.missing_sections.map((section, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;