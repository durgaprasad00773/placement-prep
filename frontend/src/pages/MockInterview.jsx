import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Goldman Sachs', 'Morgan Stanley', 'Uber', 'Atlassian',
  'Oracle', 'Flipkart', 'Walmart', 'Adobe', 'Salesforce'
];

const ROLES = [
  'SDE Intern', 'SDE-1', 'SDE-2', 'Frontend Engineer',
  'Backend Engineer', 'Full Stack Engineer', 'Data Engineer',
  'ML Engineer', 'DevOps Engineer'
];

const ROUNDS = [
  'Technical', 'System Design', 'Behavioral', 'HR', 'Mixed'
];

const TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
  'Dynamic Programming', 'Recursion', 'Sorting', 'Binary Search',
  'Stack & Queue', 'System Design', 'OOP', 'OS', 'DBMS'
];

const verdictColor = (verdict) => {
  if (verdict === 'Excellent') return { bg: '#f0fdf4', text: '#16a34a' };
  if (verdict === 'Good') return { bg: '#eff6ff', text: '#2e86de' };
  if (verdict === 'Average') return { bg: '#fffbeb', text: '#d97706' };
  return { bg: '#fef2f2', text: '#dc2626' };
};

const MockInterview = () => {
  const [config, setConfig] = useState({
    company: 'Google',
    role: 'SDE Intern',
    round: 'Technical',
    topics: [],
  });

  const [stage, setStage] = useState('config');
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTopicToggle = (topic) => {
    setConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/generate-interview', config);
      setInterview(res.data.interview);
      setCurrentQ(0);
      setAnswers({});
      setEvaluations({});
      setStage('interview');
    } catch (err) {
      setError('Failed to generate interview. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    const question = interview.questions[currentQ];
    const answer = answers[currentQ];
    if (!answer || answer.trim().length < 10) {
      setError('Please write a proper answer before evaluating.');
      return;
    }
    setEvaluating(true);
    setError('');
    try {
      const res = await api.post('/ai/evaluate-answer', {
        question: question.question,
        answer,
        company: config.company,
        role: config.role,
      });
      setEvaluations(prev => ({ ...prev, [currentQ]: res.data.evaluation }));
    } catch (err) {
      setError('Failed to evaluate answer. Try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentQ < interview.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setError('');
    } else {
      setStage('results');
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setError('');
    }
  };

  const averageScore = () => {
    const scores = Object.values(evaluations).map(e => e.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const difficultyColor = (d) => {
    if (d === 'Easy') return '#16a34a';
    if (d === 'Medium') return '#d97706';
    if (d === 'Hard') return '#dc2626';
    return '#4a6fa5';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center"
        style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PrepTrack" className="w-8 h-8 object-contain" />
          <h1 className="text-lg md:text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
        </div>
        <span onClick={() => navigate('/dashboard')}
          className="text-sm font-medium cursor-pointer"
          style={{ color: '#4a6fa5' }}>
          ← Dashboard
        </span>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8">

        {/* CONFIG STAGE */}
        {stage === 'config' && (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
              AI Mock Interview
            </h2>
            <p className="text-sm mb-6 md:mb-8" style={{ color: '#4a6fa5' }}>
              Practice with AI-generated questions tailored to your target company and role.
            </p>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a3a6b' }}>
                Configure Your Interview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                {[
                  { label: 'Company', key: 'company', options: COMPANIES },
                  { label: 'Role', key: 'role', options: ROLES },
                  { label: 'Round', key: 'round', options: ROUNDS },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1a3a6b' }}>
                      {label}
                    </label>
                    <select
                      value={config[key]}
                      onChange={e => setConfig({ ...config, [key]: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    >
                      {options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a3a6b' }}>
                  Focus Topics (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(topic => (
                    <button key={topic} type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className="px-2 md:px-3 py-1 rounded-full text-xs font-medium transition"
                      style={{
                        backgroundColor: config.topics.includes(topic) ? '#1a3a6b' : '#f0f4f8',
                        color: config.topics.includes(topic) ? 'white' : '#4a6fa5',
                        border: '1.5px solid #c5d5ea'
                      }}>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
              )}

              <button onClick={handleGenerate} disabled={loading}
                className="w-full md:w-auto text-white px-6 py-2.5 rounded-lg font-medium transition"
                style={{ backgroundColor: loading ? '#4a6fa5' : '#1a3a6b' }}>
                {loading ? '🤖 Generating Interview...' : '🎯 Start Interview'}
              </button>
            </div>
          </>
        )}

        {/* INTERVIEW STAGE */}
        {stage === 'interview' && interview && (
          <>
            {/* Interview Header */}
            <div className="bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h2 className="font-bold text-sm md:text-base" style={{ color: '#1a3a6b' }}>
                    {interview.interview_title}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: '#4a6fa5' }}>
                    {interview.company} • {interview.role} • {interview.round}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold" style={{ color: '#1a3a6b' }}>
                    Q{currentQ + 1}/{interview.questions.length}
                  </p>
                  <p className="text-xs" style={{ color: '#4a6fa5' }}>
                    {Object.keys(evaluations).length} evaluated
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full h-2 mb-4 md:mb-6" style={{ backgroundColor: '#c5d5ea' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQ + 1) / interview.questions.length) * 100}%`,
                  backgroundColor: '#1a3a6b'
                }} />
            </div>

            {/* Question Card */}
            {(() => {
              const q = interview.questions[currentQ];
              return (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-4"
                  style={{ border: '1.5px solid #c5d5ea' }}>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>{q.type}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ color: difficultyColor(q.difficulty), backgroundColor: '#f0f4f8' }}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                      ⏱ {q.time_limit}
                    </span>
                  </div>

                  <p className="font-medium mb-4 md:mb-6 text-sm md:text-base" style={{ color: '#1a3a6b' }}>
                    {q.question}
                  </p>

                  {q.hints && q.hints.length > 0 && (
                    <details className="mb-4">
                      <summary className="text-sm cursor-pointer font-medium" style={{ color: '#2e86de' }}>
                        💡 Show Hints
                      </summary>
                      <ul className="mt-2 space-y-1 pl-4">
                        {q.hints.map((hint, i) => (
                          <li key={i} className="text-xs md:text-sm" style={{ color: '#4a6fa5' }}>• {hint}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <textarea
                    value={answers[currentQ] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [currentQ]: e.target.value }))}
                    rows={6}
                    placeholder="Type your answer here... Be as detailed as possible."
                    className="w-full rounded-lg px-3 md:px-4 py-3 text-sm outline-none resize-none"
                    style={{ border: '1.5px solid #c5d5ea', color: '#1a3a6b' }}
                    onFocus={e => e.target.style.borderColor = '#2e86de'}
                    onBlur={e => e.target.style.borderColor = '#c5d5ea'}
                  />

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-3 text-sm">{error}</div>
                  )}

                  <button onClick={handleEvaluate}
                    disabled={evaluating || evaluations[currentQ]}
                    className="mt-4 w-full md:w-auto text-white px-5 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: evaluations[currentQ] ? '#4a6fa5' : '#2e86de',
                      opacity: evaluations[currentQ] ? 0.7 : 1
                    }}>
                    {evaluating ? '🤖 Evaluating...' : evaluations[currentQ] ? '✅ Evaluated' : '🤖 Evaluate Answer'}
                  </button>
                </div>
              );
            })()}

            {/* Evaluation Result */}
            {evaluations[currentQ] && (
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-4"
                style={{ border: '1.5px solid #c5d5ea' }}>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h3 className="font-semibold" style={{ color: '#1a3a6b' }}>AI Feedback</h3>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold"
                      style={{
                        backgroundColor: verdictColor(evaluations[currentQ].verdict).bg,
                        color: verdictColor(evaluations[currentQ].verdict).text
                      }}>
                      {evaluations[currentQ].verdict}
                    </span>
                    <span className="font-bold text-base md:text-lg" style={{ color: '#1a3a6b' }}>
                      {evaluations[currentQ].score}/10
                    </span>
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: '#4a6fa5' }}>
                  {evaluations[currentQ].feedback}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#16a34a' }}>✅ What was good</p>
                    <ul className="space-y-1">
                      {evaluations[currentQ].what_was_good.map((g, i) => (
                        <li key={i} className="text-xs" style={{ color: '#4a6fa5' }}>• {g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#dc2626' }}>❌ What was missing</p>
                    <ul className="space-y-1">
                      {evaluations[currentQ].what_was_missing.map((m, i) => (
                        <li key={i} className="text-xs" style={{ color: '#4a6fa5' }}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: '#f0f4f8' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#1a3a6b' }}>💡 Ideal Answer Outline</p>
                  <p className="text-xs" style={{ color: '#4a6fa5' }}>
                    {evaluations[currentQ].ideal_answer_outline}
                  </p>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fffbeb' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#d97706' }}>🔄 Follow-up Question</p>
                  <p className="text-xs" style={{ color: '#4a6fa5' }}>
                    {evaluations[currentQ].follow_up_question}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <button onClick={handlePrev} disabled={currentQ === 0}
                className="flex-1 md:flex-none px-4 md:px-5 py-2 rounded-lg text-sm font-medium"
                style={{ border: '1.5px solid #c5d5ea', color: currentQ === 0 ? '#c5d5ea' : '#4a6fa5' }}>
                ← Previous
              </button>
              <button onClick={handleNext}
                className="flex-1 md:flex-none px-4 md:px-5 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#1a3a6b' }}>
                {currentQ === interview.questions.length - 1 ? 'Finish →' : 'Next →'}
              </button>
            </div>
          </>
        )}

        {/* RESULTS STAGE */}
        {stage === 'results' && (
          <>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
                Interview Complete 🎉
              </h2>
              <p className="text-sm mb-6" style={{ color: '#4a6fa5' }}>
                {config.company} • {config.role} • {config.round}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shrink-0"
                  style={{
                    backgroundColor: averageScore() >= 7 ? '#16a34a' : averageScore() >= 5 ? '#d97706' : '#dc2626'
                  }}>
                  {averageScore()}/10
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold" style={{ color: '#1a3a6b' }}>
                    Average Score: {averageScore()}/10
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
                    {Object.keys(evaluations).length} of {interview.questions.length} questions evaluated
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
                    {averageScore() >= 7 ? '🎉 Great performance! You are ready.' :
                      averageScore() >= 5 ? '📚 Good effort. Keep practicing.' :
                        '💪 Need more practice. Review the feedback above.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {interview.questions.map((q, i) => (
                <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm flex justify-between items-center gap-3"
                  style={{ border: '1.5px solid #c5d5ea' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate" style={{ color: '#1a3a6b' }}>
                      Q{i + 1}: {q.question.substring(0, 60)}...
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#4a6fa5' }}>
                      {q.type} • {q.difficulty}
                    </p>
                  </div>
                  {evaluations[i] ? (
                    <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold shrink-0"
                      style={{
                        backgroundColor: verdictColor(evaluations[i].verdict).bg,
                        color: verdictColor(evaluations[i].verdict).text
                      }}>
                      {evaluations[i].score}/10
                    </span>
                  ) : (
                    <span className="text-xs px-2 md:px-3 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                      Skipped
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setStage('config'); setInterview(null); setAnswers({}); setEvaluations({}); }}
                className="text-white px-6 py-2.5 rounded-lg font-medium w-full sm:w-auto"
                style={{ backgroundColor: '#1a3a6b' }}>
                Start New Interview
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 rounded-lg font-medium w-full sm:w-auto"
                style={{ border: '1.5px solid #c5d5ea', color: '#4a6fa5' }}>
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockInterview;