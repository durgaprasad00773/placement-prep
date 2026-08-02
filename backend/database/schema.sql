-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Problems (DSA Tracker)
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  platform VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Unsolved' CHECK (status IN ('Solved', 'Unsolved', 'Revisit')),
  notes TEXT,
  url VARCHAR(500),
  solved_at TIMESTAMP,
  needs_revision BOOLEAN DEFAULT false,
  last_revised_at TIMESTAMP,
  revision_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OA Records
CREATE TABLE oa_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(150) NOT NULL,
  role VARCHAR(150),
  oa_date DATE,
  platform VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Cleared', 'Failed', 'No Response')),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  num_questions INTEGER,
  duration_mins INTEGER,
  topics TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  tag VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resumes
CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  version VARCHAR(50),
  notes TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Plans (AI Coach)
CREATE TABLE daily_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks JSONB NOT NULL,
  completed_tasks JSONB DEFAULT '[]',
  motivation TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);