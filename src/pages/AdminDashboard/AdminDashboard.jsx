import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import { RESOURCES, MOCK_USERS, ANALYTICS } from '../../data/mockData';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [uploadForm, setUploadForm] = useState({ title: '', author: '', category: 'textbooks', description: '', year: new Date().getFullYear() });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <main className="access-denied">
        <div className="access-denied__card">
          <div className="access-denied__icon">🛡</div>
          <h2>Admin Access Required</h2>
          <p>Login with an admin account to access the admin panel.</p>
          <button className="btn btn--primary" onClick={() => navigate('/login')}>Login as Admin</button>
        </div>
      </main>
    );
  }

  const handleUpload = (e) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
    setUploadForm({ title: '', author: '', category: 'textbooks', description: '', year: new Date().getFullYear() });
  };

  const SECTIONS = [
    { id: 'overview',  label: '📊 Overview'       },
    { id: 'upload',    label: '⬆ Upload Resource'  },
    { id: 'resources', label: '📚 Manage Resources' },
    { id: 'users',     label: '👥 Manage Users'    },
  ];

  return (
    <main className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__brand">🛡 Admin Panel</div>
        <nav className="admin__nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin__nav-btn${activeSection === s.id ? ' active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </button>
          ))}
          <button
            className="admin__nav-btn admin__logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="admin__main">
        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <section>
            <h2 className="admin__section-title">Dashboard Overview</h2>
            <div className="admin__analytics-grid">
              <AnalyticsCard icon="📚" label="Total Resources" value={ANALYTICS.totalResources} sub="↑ 3 this month" color="#1a56db" />
              <AnalyticsCard icon="👥" label="Registered Users" value={ANALYTICS.totalUsers.toLocaleString()} sub="↑ 124 this month" color="#10b981" />
              <AnalyticsCard icon="⬇" label="Total Downloads" value={ANALYTICS.totalDownloads.toLocaleString()} sub="↑ 8,200 this month" color="#f59e0b" />
              <AnalyticsCard icon="🗂" label="Categories" value={ANALYTICS.totalCategories} sub="Active" color="#8b5cf6" />
            </div>

            {/* Simple bar chart mock */}
            <div className="admin__chart-card">
              <h3>Monthly Downloads (Mock Data)</h3>
              <div className="admin__bar-chart">
                {ANALYTICS.monthlyDownloads.map(d => (
                  <div key={d.month} className="admin__bar-col">
                    <div
                      className="admin__bar"
                      style={{ height: `${(d.value / 14000) * 160}px` }}
                      title={`${d.month}: ${d.value.toLocaleString()}`}
                    />
                    <span className="admin__bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── UPLOAD ── */}
        {activeSection === 'upload' && (
          <section>
            <h2 className="admin__section-title">Upload New Resource</h2>
            {uploadSuccess && (
              <div className="admin__success-banner">
                ✅ Resource uploaded successfully! (Mock action)
              </div>
            )}
            <form className="admin__upload-form" onSubmit={handleUpload}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Resource Title <span className="required">*</span></label>
                  <input className="form-input" placeholder="e.g. Linear Algebra Done Right" value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Author(s) <span className="required">*</span></label>
                  <input className="form-input" placeholder="e.g. Sheldon Axler" value={uploadForm.author} onChange={e => setUploadForm(f => ({ ...f, author: e.target.value }))} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="textbooks">Textbook</option>
                    <option value="research">Research Paper</option>
                    <option value="guides">Study Guide</option>
                    <option value="tutorials">Tutorial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input className="form-input" type="number" min="1900" max="2030" value={uploadForm.year} onChange={e => setUploadForm(f => ({ ...f, year: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" rows={4} placeholder="Brief description of the resource…" value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (PDF/EPUB)</label>
                <div className="admin__file-drop">
                  <span>📁 Drag & drop file here or click to browse</span>
                  <input type="file" className="admin__file-input" accept=".pdf,.epub" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail URL (optional)</label>
                <input className="form-input" type="url" placeholder="https://…" />
              </div>
              <button type="submit" className="btn btn--primary btn--lg">⬆ Upload Resource</button>
            </form>
          </section>
        )}

        {/* ── RESOURCES TABLE ── */}
        {activeSection === 'resources' && (
          <section>
            <h2 className="admin__section-title">Manage Resources</h2>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Downloads</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {RESOURCES.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>
                        <div className="admin__table-resource">
                          <img src={r.thumbnail} alt={r.title} className="admin__table-thumb" />
                          <span>{r.title}</span>
                        </div>
                      </td>
                      <td><span className="cat-tag">{r.categoryLabel}</span></td>
                      <td>{r.year}</td>
                      <td>{r.downloads.toLocaleString()}</td>
                      <td>⭐ {r.rating}</td>
                      <td>
                        <div className="admin__row-actions">
                          <button className="btn btn--outline btn--sm" onClick={() => alert('Edit form coming soon (mock)')}>✏ Edit</button>
                          <button className="btn btn--danger btn--sm" onClick={() => alert(`Delete "${r.title}"? (mock)`)}>🗑 Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── USERS TABLE ── */}
        {activeSection === 'users' && (
          <section>
            <h2 className="admin__section-title">Manage Users</h2>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Downloads</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <div className="admin__table-user">
                          <div className="admin__user-avatar">{u.name.charAt(0)}</div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td><span className={`role-tag role-tag--${u.role}`}>{u.role}</span></td>
                      <td>{u.joined}</td>
                      <td>{u.downloads}</td>
                      <td><span className={`status-tag status-tag--${u.status}`}>{u.status}</span></td>
                      <td>
                        <div className="admin__row-actions">
                          <button className="btn btn--outline btn--sm" onClick={() => alert('View user profile (mock)')}>👁 View</button>
                          <button className="btn btn--danger btn--sm" onClick={() => alert(`Suspend ${u.name}? (mock)`)}>🚫 Suspend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
