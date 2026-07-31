import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const priorityColor = (priority) => {
  if (priority === 'High') return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
  if (priority === 'Medium') return { bg: '#fffbeb', text: '#d97706', border: '#fcd34d' };
  return { bg: '#f0f4f8', text: '#4a6fa5', border: '#c5d5ea' };
};

const categoryIcon = (category) => {
  if (category === 'DSA') return '🧩';
  if (category === 'Revision') return '📌';
  if (category === 'OA Prep') return '📝';
  if (category === 'Concept') return '📚';
  if (category === 'Break') return '☕';
  return '📋';
};

const DailyCoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchPlan = async () => {
    try {
      const res = await api.get(`/ai/daily-plan?date=${today}`);
      setPlan(res.data.plan);
    } catch (err) {
      if (err.response?.status === 404) {
        setPlan(null);
      } else {
        setError('Failed to fetch plan');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await api.post('/ai/daily-plan', { date: today });
      setPlan(res.data.plan);
    } catch (err) {
      setError('Failed to generate plan. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.put('/ai/daily-plan/complete', {
        date: today,
        task_id: taskId,
      });
      setPlan(res.data.plan);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const completedCount = plan ? (plan.completed_tasks || []).length : 0;
  const totalTasks = plan ? (plan.tasks || []).length : 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const isCompleted = (taskId) => {
    return plan && (plan.completed_tasks || []).includes(taskId);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <p style={{ color: '#1a3a6b' }}>Loading...</p>
    </div>
  );

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

      <div className="max-w-3xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#1a3a6b' }}>
            AI Daily Coach
          </h2>
          <p className="text-sm mt-1" style={{ color: '#4a6fa5' }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {/* No plan yet */}
        {!plan && !generating && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-5xl mb-4">🤖</p>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
              No plan for today yet
            </h3>
            <p className="text-sm mb-6" style={{ color: '#4a6fa5' }}>
              Let AI analyze your progress and create a personalized study plan for today.
            </p>
            <button
              onClick={handleGenerate}
              className="text-white px-8 py-3 rounded-lg font-semibold transition"
              style={{ backgroundColor: '#1a3a6b' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
            >
              🎯 Generate Today's Plan
            </button>
          </div>
        )}

        {/* Generating */}
        {generating && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm"
            style={{ border: '1.5px solid #c5d5ea' }}>
            <p className="text-5xl mb-4">🤖</p>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a3a6b' }}>
              Analyzing your progress...
            </h3>
            <p className="text-sm" style={{ color: '#4a6fa5' }}>
              Creating your personalized plan. This takes 10-15 seconds.
            </p>
          </div>
        )}

        {/* Plan exists */}
        {plan && !generating && (
          <>
            {/* Motivation Card */}
            <div className="rounded-xl p-6 mb-6 text-white"
              style={{ backgroundColor: '#1a3a6b' }}>
              <p className="text-xs font-semibold mb-2 opacity-70">
                TODAY'S MOTIVATION
              </p>
              <p className="text-lg font-medium leading-relaxed">
                "{plan.motivation}"
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm"
              style={{ border: '1.5px solid #c5d5ea' }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold" style={{ color: '#1a3a6b' }}>
                  Today's Progress
                </h3>
                <span className="font-bold" style={{ color: '#2e86de' }}>
                  {completedCount}/{totalTasks} tasks
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full rounded-full h-3" style={{ backgroundColor: '#f0f4f8' }}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: progressPercent === 100 ? '#16a34a' : '#2e86de'
                  }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <p className="text-xs" style={{ color: '#4a6fa5' }}>
                  {progressPercent}% complete
                </p>
                {progressPercent === 100 && (
                  <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>
                    🎉 All tasks done!
                  </p>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-4 mb-6">
              {(plan.tasks || []).map((task, i) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-5 shadow-sm transition"
                  style={{
                    border: `1.5px solid ${isCompleted(task.id) ? '#86efac' : '#c5d5ea'}`,
                    opacity: isCompleted(task.id) ? 0.8 : 1
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition"
                      style={{
                        borderColor: isCompleted(task.id) ? '#16a34a' : '#c5d5ea',
                        backgroundColor: isCompleted(task.id) ? '#16a34a' : 'white'
                      }}
                    >
                      {isCompleted(task.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span>{categoryIcon(task.category)}</span>
                          <h4 className="font-semibold text-sm"
                            style={{
                              color: '#1a3a6b',
                              textDecoration: isCompleted(task.id) ? 'line-through' : 'none'
                            }}>
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: priorityColor(task.priority).bg,
                              color: priorityColor(task.priority).text
                            }}>
                            {task.priority}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#f0f4f8', color: '#4a6fa5' }}>
                            ⏱ {task.duration}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs mt-2" style={{ color: '#4a6fa5' }}>
                        {task.description}
                      </p>

                      {task.resources && task.resources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.resources.map((r, ri) => (
                            <span key={ri} className="text-xs px-2 py-0.5 rounded"
                              style={{ backgroundColor: '#eff6ff', color: '#2e86de' }}>
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regenerate note */}
            <div className="text-center">
              <p className="text-xs" style={{ color: '#c5d5ea' }}>
                Plan generated for today. Come back tomorrow for a new personalized plan.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyCoach;