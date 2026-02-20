import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing">
      <section className="landing__hero landing__hero--full">
        <div className="landing__hero-shapes" aria-hidden>
          <span className="lh-shape lh-shape--1" />
          <span className="lh-shape lh-shape--2" />
          <span className="lh-shape lh-shape--3" />
        </div>

        <div className="container landing__hero-content">
          <div className="landing__hero-badge">
            Open Educational Resources · FSAD-PS28
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
              Browse Library
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
    </main>
  );
}
