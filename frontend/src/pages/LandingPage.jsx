import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <img src="/dsa_logo.png" alt="Resume" className="w-8 h-8 object-contain" />,
    title: 'DSA Tracker',
    description: 'Track every problem you solve. Filter by topic, difficulty, and status. Never lose track of your progress.',
  },
  {
    icon: '📝',
    title: 'OA Manager',
    description: 'Log every Online Assessment. Track companies, platforms, difficulty, and your performance.',
  },
  {
    icon: '📒',
    title: 'Notes Manager',
    description: 'Store topic-wise notes, key observations, and revision material all in one place.',
  },
  {
    icon: <img src="resume_logo.png" alt="Resume" className="w-8 h-8 object-contain" />,
    title: 'Resume Manager',
    description: 'Upload and manage multiple resume versions. Store PDFs on cloud and track which version is active.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Visualize your prep progress with charts — solve rate, topic distribution, OA success rate.',
  },
  {
    icon: '📌',
    title: 'Revision Tracking',
    description: 'Mark problems for revision, track how many times you\'ve revised, and never forget weak topics.',
  },
  {
    icon: '🤖',
    title: 'AI Daily Coach',
    description: 'Get personalized daily targets based on your progress. AI adapts your plan if you miss targets.',
  },
  {
    icon: '📑',
    title: 'AI Resume Analyzer',
    description: 'Get AI-powered feedback on your resume. Identify gaps and improve before applying.',
  },
  {
    icon: '🎯',
    title: 'AI Mock Interviews',
    description: 'Practice with AI-generated interview questions tailored to your target companies.',
  },
];

const steps = [
  { step: '01', title: 'Sign Up', description: 'Create your free account in seconds' },
  { step: '02', title: 'Track Progress', description: 'Log DSA problems, OAs, and notes daily' },
  { step: '03', title: 'Get AI Insights', description: 'Let AI guide your preparation strategy' },
  { step: '04', title: 'Land the Job', description: 'Walk into interviews fully prepared' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium px-4 py-2 rounded-lg transition"
              style={{ color: '#1a3a6b', border: '1.5px solid #1a3a6b' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4f8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition"
              style={{ backgroundColor: '#1a3a6b' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: '#1a3a6b' }} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold px-5 py-2 rounded-full mb-6 inline-block"
            style={{ backgroundColor: '#2e86de', color: 'white' }}>
            Built for CS Students <br/> By Mechanical student
          </span>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Your All-in-One<br />
            <span style={{ color: '#2e86de' }}>Placement Prep</span> Platform
          </h2>
          <p className="text-lg mb-10" style={{ color: '#c5d5ea' }}>
            Track DSA problems, manage OAs, analyze your resume with AI,
            and practice mock interviews — all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 rounded-lg font-semibold text-white transition"
              style={{ backgroundColor: '#2e86de' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a6fc4'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2e86de'}
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg font-semibold transition"
              style={{ backgroundColor: 'transparent', color: 'white', border: '1.5px solid #c5d5ea' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Log In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: '9+', label: 'Features' },
              { value: '3', label: 'AI Tools' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm mt-1" style={{ color: '#c5d5ea' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3" style={{ color: '#1a3a6b' }}>
              Everything You Need to Crack Placements
            </h3>
            <p style={{ color: '#4a6fa5' }}>
              From DSA tracking to AI-powered mock interviews — we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm transition"
                style={{ border: '1.5px solid #c5d5ea' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2e86de'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#c5d5ea'}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold mb-2" style={{ color: '#1a3a6b' }}>{feature.title}</h4>
                <p className="text-sm" style={{ color: '#4a6fa5' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8" style={{ backgroundColor: '#1a3a6b' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-3">How It Works</h3>
            <p style={{ color: '#c5d5ea' }}>Start your placement prep journey in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-white"
                  style={{ backgroundColor: '#2e86de' }}>
                  {step.step}
                </div>
                <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-sm" style={{ color: '#c5d5ea' }}>{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#1a3a6b' }}>
            Ready to Ace Your Placements?
          </h3>
          <p className="mb-8" style={{ color: '#4a6fa5' }}>
            Join thousands of students who are using PrepTrack to land their dream internships.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-3 rounded-lg font-semibold text-white transition"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8" style={{ backgroundColor: '#1a3a6b', borderTop: '1px solid #142d54' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: 'white' }}>PrepTrack</h1>
          </div>
          <p className="text-sm" style={{ color: '#c5d5ea' }}>
            Built for CS students, by Mechanical student.
          </p>
          <div className="flex gap-6">
            <span onClick={() => navigate('/login')}
              className="text-sm cursor-pointer hover:underline" style={{ color: '#c5d5ea' }}>
              Login
            </span>
            <span onClick={() => navigate('/signup')}
              className="text-sm cursor-pointer hover:underline" style={{ color: '#c5d5ea' }}>
              Sign Up
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;