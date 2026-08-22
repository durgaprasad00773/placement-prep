import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <img src="/dsa_logo.png" alt="DSA" className="w-8 h-8 object-contain" />,
    title: 'DSA Tracker',
    description: 'Track every problem you solve. Filter by topic, difficulty, and status.',
  },
  {
    icon: '📝',
    title: 'OA Manager',
    description: 'Log every Online Assessment. Track companies, platforms, and performance.',
  },
  {
    icon: '📒',
    title: 'Notes Manager',
    description: 'Store topic-wise notes, key observations, and revision material.',
  },
  {
    icon: <img src="/resume_logo.png" alt="Resume" className="w-8 h-8 object-contain" />,
    title: 'Resume Manager',
    description: 'Upload and manage multiple resume versions. Store PDFs on cloud.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Visualize your prep progress with charts and statistics.',
  },
  {
    icon: '📌',
    title: 'Revision Tracking',
    description: 'Mark problems for revision and never forget weak topics.',
  },
  {
    icon: '🤖',
    title: 'AI Daily Coach',
    description: 'Personalized daily targets. AI adapts your plan if you miss targets.',
  },
  {
    icon: '📑',
    title: 'AI Resume Analyzer',
    description: 'AI feedback on your resume. Fix gaps before applying.',
  },
  {
    icon: '🎯',
    title: 'AI Mock Interviews',
    description: 'Company-specific questions. Get evaluated instantly.',
  },
  {
    icon: '🗺️',
    title: 'Company Roadmaps',
    description: 'AI roadmap tailored to your target company and role.',
  }, 
  {
    icon: '💬',
    title: 'Experience Sharing',
    description: 'Share and read experiences from other students.',
  }
];

const steps = [
  { step: '01', title: 'Sign Up', description: 'Create your free account in seconds' },
  { step: '02', title: 'Track Progress', description: 'Log DSA problems, OAs, and notes daily' },
  { step: '03', title: 'Get AI Insights', description: 'Let AI guide your preparation strategy' },
  { step: '04', title: 'Land the Job', description: 'Walk into interviews fully prepared' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50" style={{ borderBottom: '2px solid #c5d5ea' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold" style={{ color: '#1a3a6b' }}>PrepTrack</h1>
        </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-5 h-0.5 block" style={{ backgroundColor: '#1a3a6b' }}></span>
            <span className="w-5 h-0.5 block" style={{ backgroundColor: '#1a3a6b' }}></span>
            <span className="w-5 h-0.5 block" style={{ backgroundColor: '#1a3a6b' }}></span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2"
            style={{ borderTop: '1px solid #c5d5ea' }}>
            <button
              onClick={() => { navigate('/login'); setMenuOpen(false); }}
              className="w-full text-sm font-medium px-4 py-2.5 rounded-lg text-left"
              style={{ color: '#1a3a6b', border: '1.5px solid #1a3a6b' }}
            >
              Log In
            </button>
            <button
              onClick={() => { navigate('/signup'); setMenuOpen(false); }}
              className="w-full text-sm font-medium px-4 py-2.5 rounded-lg text-white text-left"
              style={{ backgroundColor: '#1a3a6b' }}
            >
              Sign Up Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: '#1a3a6b' }} className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full mb-6 inline-block"
            style={{ backgroundColor: '#2e86de', color: 'white' }}>
            Built for CS Students
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your All-in-One<br />
            <span style={{ color: '#2e86de' }}>Placement Prep</span> Platform
          </h2>
          <p className="text-base md:text-lg mb-10 px-2" style={{ color: '#c5d5ea' }}>
            Track DSA problems, manage OAs, analyze your resume with AI,
            and practice mock interviews — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 rounded-lg font-semibold text-white transition w-full sm:w-auto"
              style={{ backgroundColor: '#2e86de' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a6fc4'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2e86de'}
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg font-semibold transition w-full sm:w-auto"
              style={{ backgroundColor: 'transparent', color: 'white', border: '1.5px solid #c5d5ea' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Log In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 max-w-lg mx-auto">
            {[
              { value: '10+', label: 'Features' },
              { value: '4', label: 'AI Tools' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm mt-1" style={{ color: '#c5d5ea' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#1a3a6b' }}>
              Everything You Need to Crack Placements
            </h3>
            <p className="text-sm md:text-base px-4" style={{ color: '#4a6fa5' }}>
              From DSA tracking to AI-powered mock interviews — we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-5 md:p-6 shadow-sm transition"
                style={{ border: '1.5px solid #c5d5ea' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2e86de'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#c5d5ea'}
              >
                <div className="mb-3">
                  {typeof feature.icon === 'string'
                    ? <span className="text-2xl md:text-3xl">{feature.icon}</span>
                    : feature.icon}
                </div>
                <h4 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#1a3a6b' }}>
                  {feature.title}
                </h4>
                <p className="text-xs md:text-sm" style={{ color: '#4a6fa5' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 md:px-8" style={{ backgroundColor: '#1a3a6b' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">How It Works</h3>
            <p className="text-sm md:text-base" style={{ color: '#c5d5ea' }}>
              Start your placement prep journey in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-bold text-white text-sm"
                  style={{ backgroundColor: '#2e86de' }}>
                  {step.step}
                </div>
                <h4 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">
                  {step.title}
                </h4>
                <p className="text-xs md:text-sm" style={{ color: '#c5d5ea' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1a3a6b' }}>
            Ready to Ace Your Placements?
          </h3>
          <p className="text-sm md:text-base mb-8 px-4" style={{ color: '#4a6fa5' }}>
            Join thousands of students who are using PrepTrack to land their dream internships.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 md:px-10 py-3 rounded-lg font-semibold text-white transition w-full sm:w-auto"
            style={{ backgroundColor: '#1a3a6b' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#142d54'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a3a6b'}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-8"
        style={{ backgroundColor: '#1a3a6b', borderTop: '1px solid #142d54' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://imgs.search.brave.com/4num3GouoaQ-kNcQtc1glN1ALOpz4Zm_mtaVFLpK-_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy5wcmVwaW5zdGEu/Y29tLzIwMjIvMDcv/cGxhY2VtZW50LXBy/ZXBhcmF0aW9uLWJv/b2tzLWZvci1lbmdp/bmVlcmluZy1zdHVk/ZW50cy53ZWJw" alt="PrepTrack" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold text-white">PrepTrack</h1>
          </div>
          <p className="text-xs md:text-sm text-center" style={{ color: '#c5d5ea' }}>
            Built for CS students.
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