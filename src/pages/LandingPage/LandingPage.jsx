import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  {
    icon: '📖',
    title: 'Textbooks',
    desc: 'Peer-reviewed academic textbooks across science, engineering, humanities and more.',
  },
  {
    icon: '🔬',
    title: 'Research Papers',
    desc: 'Access landmark research papers and preprints from leading academic institutions.',
  },
  {
    icon: '📝',
    title: 'Study Guides',
    desc: 'Concise, well-structured revision guides to help you prepare for exams efficiently.',
  },
  {
    icon: '🎓',
    title: 'Tutorials',
    desc: 'Step-by-step practical tutorials for programming, mathematics and applied sciences.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Nair',
    role: 'MSc Computer Science',
    quote: 'Library Freedom saved me hours of searching. Every resource I need is one click away.',
  },
  {
    name: 'Rahul Verma',
    role: 'BTech Electronics',
    quote: 'The research paper collection is incredible. Highly recommend to every engineering student.',
  },
  {
    name: 'Dr Ananya Sharma',
    role: 'Faculty, Mathematics',
    quote: 'A professional, clean platform I confidently recommend to all my students.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing">
      {/* ───── HERO ───── */}
      <section className="landing__hero">
        <div className="landing__hero-shapes" aria-hidden>
          <span className="lh-shape lh-shape--1" />
          <span className="lh-shape lh-shape--2" />
          <span className="lh-shape lh-shape--3" />
        </div>

        <div className="container landing__hero-content">
          <div className="landing__hero-badge">
            📖 Open Educational Resources &nbsp;·&nbsp; FSAD-PS28
          </div>

          <h1 className="landing__hero-title">
            Access Educational Resources{' '}
            <span className="landing__hero-highlight">Freely</span>
          </h1>

          <p className="landing__hero-subtitle">
            Library Freedom is a professional open-access hub for students, researchers
            and educators. Browse curated textbooks, research papers, study guides and
            tutorials — all free, all in one place.
          </p>

          <div className="landing__hero-actions">
            <button
              className="btn btn--primary btn--lg landing__cta-primary"
              onClick={() => navigate('/home')}
            >
              📚 Browse Library
            </button>
            <button
              className="btn btn--outline-white btn--lg"
              onClick={() => navigate('/signup')}
            >
              Create Free Account
            </button>
          </div>

          <div className="landing__hero-stats">
            <div className="landing__stat">
              <strong>12+</strong>
              <span>Curated Resources</span>
            </div>
            <div className="landing__stat-divider" aria-hidden />
            <div className="landing__stat">
              <strong>4</strong>
              <span>Subject Categories</span>
            </div>
            <div className="landing__stat-divider" aria-hidden />
            <div className="landing__stat">
              <strong>1M+</strong>
              <span>Total Downloads</span>
            </div>
            <div className="landing__stat-divider" aria-hidden />
            <div className="landing__stat">
              <strong>100%</strong>
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="landing__features">
        <div className="container">
          <div className="landing__section-header">
            <h2 className="landing__section-title">Everything You Need, In One Place</h2>
            <p className="landing__section-sub">
              Four categories of high-quality educational materials, carefully selected
              and kept up to date by our editorial team.
            </p>
          </div>

          <div className="landing__features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="landing__feature-card">
                <div className="landing__feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="landing__how">
        <div className="container">
          <div className="landing__section-header">
            <h2 className="landing__section-title">How It Works</h2>
            <p className="landing__section-sub">Three simple steps to access any resource.</p>
          </div>

          <div className="landing__steps">
            <div className="landing__step">
              <div className="landing__step-number">1</div>
              <h3>Search or Browse</h3>
              <p>Use the search bar or filter by category to find exactly what you need.</p>
            </div>
            <div className="landing__step-arrow" aria-hidden>→</div>
            <div className="landing__step">
              <div className="landing__step-number">2</div>
              <h3>Preview the Resource</h3>
              <p>Open the preview modal to check the full details before downloading.</p>
            </div>
            <div className="landing__step-arrow" aria-hidden>→</div>
            <div className="landing__step">
              <div className="landing__step-number">3</div>
              <h3>Download for Free</h3>
              <p>Click Download — no subscription, no payment, no restrictions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="landing__testimonials">
        <div className="container">
          <div className="landing__section-header">
            <h2 className="landing__section-title">Trusted by Students & Educators</h2>
          </div>

          <div className="landing__testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="landing__testimonial-card">
                <div className="landing__testimonial-quote">"</div>
                <p className="landing__testimonial-text">{t.quote}</p>
                <div className="landing__testimonial-author">
                  <div className="landing__testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="landing__testimonial-name">{t.name}</p>
                    <p className="landing__testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA BANNER ───── */}
      <section className="landing__cta-banner">
        <div className="container landing__cta-banner-inner">
          <div>
            <h2>Ready to start learning?</h2>
            <p>Join thousands of students who rely on Library Freedom every day.</p>
          </div>
          <div className="landing__cta-banner-actions">
            <button className="btn btn--primary btn--lg" onClick={() => navigate('/home')}>
              📚 Browse Library
            </button>
            <button className="btn btn--outline-white btn--lg" onClick={() => navigate('/signup')}>
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
