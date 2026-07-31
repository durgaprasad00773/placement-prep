import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Goldman Sachs', 'Morgan Stanley', 'Uber', 'Atlassian',
  'Oracle', 'Flipkart', 'Walmart', 'Adobe', 'Salesforce',
  'Infosys', 'TCS', 'Wipro'
];

const ROLES = [
  'SDE Intern', 'SDE-1', 'SDE-2', 'Frontend Engineer',
  'Backend Engineer', 'Full Stack Engineer', 'Data Engineer',
  'ML Engineer', 'DevOps Engineer'
];

const TIMELINES = ['1 month', '2 months', '3 months', '6 months'];

const importanceColor = (importance) => {
  if (importance === 'High') return { bg: '#fef2f2', text: '#dc2626' };
  if (importance === 'Medium') return { bg: '#fffbeb', text: '#d97706' };
  return { bg: '#f0f4f8', text: '#4a6fa5' };
};

const difficultyColor = (difficulty) => {
  if (difficulty === 'Hard') return { bg: '#fef2f2', text: '#dc2626' };
  if (difficulty === 'Medium') return { bg: '#fffbeb', text: '#d97706' };
  return { bg: '#f0fdf4', text: '#16a34a' };
};

const CompanyRoadmap = () => {
  const [config, setConfig] = useState({
    company: 'Google',
    role: 'SDE Intern',
    timeline: '3 months',
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setRoadmap(null);
    try {
      const res = await api.post('/ai/roadmap', config);
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError('Failed to generate roadmap. Try again.');
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
          Company Roadmaps
        </h2>
        <p className="text-sm mb-8" style={{ color: '#4a6fa5' }}>
          Get a personalized preparation roadmap for your target company.
        </p>

        {/* Config Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6"
          style={{ border: '1.5px solid #c5d5ea' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
            Select Target Company
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Company
              </label>
              <select
                value={config.company}
                onChange={e => setConfig({ ...config, company: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              >
                {COMPANIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Role
              </label>
              <select
                value={config.role}
                onChange={e => setConfig({ ...config, role: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              >
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                Timeline
              </label>
              <select
                value={config.timeline}
                onChange={e => setConfig({ ...config, timeline: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
              >
                {TIMELINES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-white px-6 py-2.5 rounded-lg font-medium transition"
            style={{ backgroundColor: loading ? '#4a6fa5' : '#1a3a6b' }}
          >
            {loading ? '🤖 Generating Roadmap...' : '🗺️ Generate Roadmap'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {loading && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-4xl mb-4">🗺️</p>
            <p className="font-semibold" style={{ color: '#1a3a6b' }}>
              Generating your roadmap...
            </p>
            <p className="text-sm mt-2" style={{ color: '#4a6fa5' }}>
              This takes 10-15 seconds
            </p>
          </div>
        )}

        {roadmap && !loading && (
          <div className="space-y-6">

            {/* Overview */}
            <div className="rounded-xl p-6 text-white"
              style={{ backgroundColor: '#1a3a6b' }}>
              <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                <div>
                  <h3 className="text-xl font-bold">{roadmap.company} — {roadmap.role}</h3>
                  <p className="text-sm mt-1 opacity-70">Timeline: {roadmap.timeline}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: difficultyColor(roadmap.difficulty).bg,
                    color: difficultyColor(roadmap.difficulty).text
                  }}>
                  {roadmap.difficulty} Difficulty
                </span>
              </div>
              <p className="text-sm leading-relaxed opacity-90">{roadmap.overview}</p>
            </div>

            {/* Hiring Process */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                🏢 Hiring Process
              </h3>
              <div className="space-y-4">
                {roadmap.hiring_process.map((round, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: '#2e86de' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-4"
                      style={{ borderBottom: i < roadmap.hiring_process.length - 1 ? '1px solid #c5d5ea' : 'none' }}>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <p className="font-semibold text-sm" style={{ color: '#1a3a6b' }}>
                          {round.round}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                          {round.duration}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#4a6fa5' }}>
                        {round.description}
                      </p>
                      <p className="text-xs mt-2 font-medium" style={{ color: '#2e86de' }}>
                        💡 {round.tips}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Topics */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                📚 Core Topics to Master
              </h3>
              <div className="space-y-4">
                {roadmap.core_topics.map((topic, i) => (
                  <div key={i} className="p-4 rounded-lg"
                    style={{ backgroundColor: '#f0f4f8' }}>
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                      <p className="font-semibold text-sm" style={{ color: '#1a3a6b' }}>
                        {topic.topic}
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: importanceColor(topic.importance).bg,
                            color: importanceColor(topic.importance).text
                          }}>
                          {topic.importance} Priority
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                          {topic.recommended_problems} problems
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {topic.subtopics.map((sub, si) => (
                        <span key={si} className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'white', color: '#4a6fa5', border: '1px solid #c5d5ea' }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {topic.resources.map((r, ri) => (
                        <span key={ri} className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                          📖 {r}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Plan */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                📅 Weekly Plan
              </h3>
              <div className="space-y-4">
                {roadmap.weekly_plan.map((week, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0">
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: '#1a3a6b' }}>
                        {week.week}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2" style={{ color: '#1a3a6b' }}>
                        {week.focus}
                      </p>
                      <ul className="space-y-1">
                        {week.goals.map((goal, gi) => (
                          <li key={gi} className="text-xs flex gap-2"
                            style={{ color: '#4a6fa5' }}>
                            <span style={{ color: '#2e86de' }}>•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Must Know + Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                  ⚡ Must Know
                </h3>
                <ul className="space-y-2">
                  {roadmap.must_know.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: '#16a34a' }}>✓</span>
                      <span style={{ color: '#4a6fa5' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                  ⚠️ Common Mistakes
                </h3>
                <ul className="space-y-2">
                  {roadmap.common_mistakes.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: '#dc2626' }}>✗</span>
                      <span style={{ color: '#4a6fa5' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Insider Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                🎯 Insider Tips
              </h3>
              <div className="space-y-3">
                {roadmap.insider_tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: '#f0f4f8' }}>
                    <span className="text-lg">💡</span>
                    <p className="text-sm" style={{ color: '#4a6fa5' }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                📖 Recommended Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#1a3a6b' }}>DSA</p>
                  <ul className="space-y-1">
                    {roadmap.recommended_resources.dsa.map((r, i) => (
                      <li key={i} className="text-xs flex gap-1" style={{ color: '#4a6fa5' }}>
                        <span style={{ color: '#2e86de' }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#1a3a6b' }}>System Design</p>
                  <ul className="space-y-1">
                    {roadmap.recommended_resources.system_design.map((r, i) => (
                      <li key={i} className="text-xs flex gap-1" style={{ color: '#4a6fa5' }}>
                        <span style={{ color: '#2e86de' }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#1a3a6b' }}>Behavioral</p>
                  <ul className="space-y-1">
                    {roadmap.recommended_resources.behavioral.map((r, i) => (
                      <li key={i} className="text-xs flex gap-1" style={{ color: '#4a6fa5' }}>
                        <span style={{ color: '#2e86de' }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyRoadmap;