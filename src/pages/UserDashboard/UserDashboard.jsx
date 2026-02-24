import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Search, Download, User, LogOut } from 'lucide-react';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ResourceCard from '../../components/ResourceCard/ResourceCard';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import BrandLogo from '../../components/brand/BrandLogo';
import { RESOURCES } from '../../data/mockData';
import './UserDashboard.css';

const MOCK_HISTORY = RESOURCES.slice(0, 4);

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  if (!user) {
    return (
      <main className="access-denied">
        <div className="access-denied__card">
          <div className="access-denied__icon"><Lock size={44} strokeWidth={1.5} aria-hidden="true" /></div>
          <h2>Please log in</h2>
          <p>You must be logged in to view your dashboard.</p>
          <button className="btn btn--primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </main>
    );
  }

  const filtered = RESOURCES.filter(r => {
    const matchCat = category === 'all' || r.category === category;
    const q = search.toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <main className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <Link to="/" className="dashboard__brand">
          <BrandLogo size="sm" />
        </Link>
        <div className="dashboard__profile">
          <div className="dashboard__avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="dashboard__user-name">{user.name}</p>
            <p className="dashboard__user-role">{user.role}</p>
          </div>
        </div>
        <nav className="dashboard__nav">
          {[
            { id: 'browse',  label: 'Browse',          icon: <Search size={15} aria-hidden="true" /> },
            { id: 'history', label: 'History',           icon: <Download size={15} aria-hidden="true" /> },
            { id: 'profile', label: 'My Profile',        icon: <User size={15} aria-hidden="true" /> },
          ].map(tab => (
            <button
              key={tab.id}
              className={`dashboard__nav-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button className="dashboard__nav-btn dashboard__logout" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={15} aria-hidden="true" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="dashboard__main">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'browse' && (
            <Motion.section
              key="browse"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            >
              <h2 className="dashboard__section-title">Browse Resources</h2>
              <div className="dashboard__toolbar">
                <SearchBar value={search} onChange={setSearch} />
                <CategoryFilter active={category} onSelect={setCategory} />
              </div>
              <div className="resource-grid" style={{ marginTop: '1.5rem' }}>
                {filtered.map(r => (
                  <ResourceCard key={r.id} resource={r} onPreview={setPreviewResource} onFeedback={setFeedbackResource} />
                ))}
              </div>
            </Motion.section>
          )}

          {activeTab === 'history' && (
            <Motion.section
              key="history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            >
              <h2 className="dashboard__section-title">Download History</h2>
              <div className="dashboard__history-list">
                {MOCK_HISTORY.map(r => (
                  <div key={r.id} className="dashboard__history-item">
                    <img src={r.thumbnail} alt={r.title} className="dashboard__history-thumb" />
                    <div className="dashboard__history-info">
                      <p className="dashboard__history-title">{r.title}</p>
                      <p className="dashboard__history-meta">{r.categoryLabel} • {r.year} • {r.fileSize}</p>
                    </div>
                    <button className="btn btn--primary btn--sm" onClick={() => alert('Re-download started (mock)')}><Download size={14} aria-hidden="true" /> Again</button>
                  </div>
                ))}
              </div>
            </Motion.section>
          )}

          {activeTab === 'profile' && (
            <Motion.section
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            >
              <h2 className="dashboard__section-title">My Profile</h2>
              <div className="dashboard__profile-card">
                <div className="dashboard__profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="form-group" style={{ width: '100%', maxWidth: 400 }}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" defaultValue={user.name} />
                </div>
                <div className="form-group" style={{ width: '100%', maxWidth: 400 }}>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" defaultValue={user.email} />
                </div>
                <button className="btn btn--primary" onClick={() => alert('Profile updated! (mock)')}>Save Changes</button>
              </div>
            </Motion.section>
          )}
        </AnimatePresence>
      </div>

      {previewResource && <PreviewModal resource={previewResource} onClose={() => setPreviewResource(null)} />}
      {feedbackResource && <FeedbackForm resource={feedbackResource} onClose={() => setFeedbackResource(null)} />}
    </main>
  );
}
