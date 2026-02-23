import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { RESOURCES, MOCK_USERS, ANALYTICS } from '../../data/mockData';
import './AdminDashboard.css';

/* ── Helper components ─────────────────────────────────────── */

function SkeletonRow({ cols }) {
  return (
    <tr className="admin__skeleton-row">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><div className="admin__skeleton" /></td>
      ))}
    </tr>
  );
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div className="admin__empty">
      <div className="admin__empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{sub}</p>
      {action && <button className="btn btn--primary btn--sm" onClick={onAction}>{action}</button>}
    </div>
  );
}

function StatCard({ icon, label, value, delta, color }) {
  return (
    <div className="admin__stat-card">
      <div className="admin__stat-icon" style={{ background: color + '22', color }}>{icon}</div>
      <div className="admin__stat-body">
        <span className="admin__stat-label">{label}</span>
        <span className="admin__stat-value">{value}</span>
        {delta && <span className="admin__stat-delta">{delta}</span>}
      </div>
    </div>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`admin-toast admin-toast--${type}`}>{message}</div>;
}

const INITIAL_UPLOAD = { title: '', author: '', category: 'textbooks', description: '', year: new Date().getFullYear(), tags: '', status: 'draft' };

const SECTIONS = [
  { id: 'overview',   label: 'Overview',         icon: '📊' },
  { id: 'resources',  label: 'Resources',         icon: '📚' },
  { id: 'upload',     label: 'Upload Resource',   icon: '⬆' },
  { id: 'users',      label: 'Users',             icon: '👥' },
  { id: 'analytics',  label: 'Analytics',         icon: '📈' },
  { id: 'settings',   label: 'Settings',          icon: '⚙' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toastCounter = useRef(0);

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Resources
  const [resources, setResources] = useState(() =>
    RESOURCES.map(r => ({ ...r, status: r.featured ? 'published' : 'draft', uploadDate: '2024-01-15' }))
  );
  const [resLoading, setResLoading] = useState(false);
  const [resSearch, setResSearch] = useState('');

  // Users
  const [users, setUsers] = useState(MOCK_USERS);
  const [usrSearch, setUsrSearch] = useState('');

  // Upload form
  const [uploadForm, setUploadForm] = useState(INITIAL_UPLOAD);
  const [uploadErrors, setUploadErrors] = useState({});
  const [uploadLoading, setUploadLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // Settings
  const [settings, setSettings] = useState({
    siteName: 'ReadSpace',
    maintenanceMode: false,
    allowRegistrations: true,
    maxFileSize: '25',
    defaultCategory: 'textbooks',
  });

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

  const showToast = (message, type = 'success') => {
    toastCounter.current += 1;
    setToast({ message, type, key: toastCounter.current });
  };

  const handleNavClick = (id) => {
    if (id === activeSection) { setSidebarOpen(false); return; }
    setResLoading(true);
    setActiveSection(id);
    setSidebarOpen(false);
    setTimeout(() => setResLoading(false), 700);
  };

  /* ── Resource actions ── */
  const toggleStatus = (id) => {
    setResources(rs => rs.map(r =>
      r.id === id ? { ...r, status: r.status === 'published' ? 'draft' : 'published' } : r
    ));
    showToast('Resource status updated.');
  };

  const deleteResource = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setResources(rs => rs.filter(r => r.id !== id));
    showToast('Resource deleted.', 'error');
  };

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(resSearch.toLowerCase()) ||
    r.categoryLabel.toLowerCase().includes(resSearch.toLowerCase())
  );

  /* ── User actions ── */
  const toggleUserStatus = (id) => {
    setUsers(us => us.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    showToast('User status updated.');
  };

  const changeRole = (id, role) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    showToast('Role updated.');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(usrSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(usrSearch.toLowerCase())
  );

  /* ── Upload ── */
  const validateUpload = () => {
    const errs = {};
    if (!uploadForm.title.trim()) errs.title = 'Title is required.';
    if (!uploadForm.author.trim()) errs.author = 'Author is required.';
    if (!uploadForm.description.trim()) errs.description = 'Description is required.';
    return errs;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const errs = validateUpload();
    if (Object.keys(errs).length) { setUploadErrors(errs); return; }
    setUploadErrors({});
    setUploadLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUploadLoading(false);
    setUploadForm(INITIAL_UPLOAD);
    showToast('Resource uploaded successfully!');
  };

  const activeSectionLabel = SECTIONS.find(s => s.id === activeSection)?.label || '';

  /* ── Category breakdown data ── */
  const catBreakdown = [
    { label: 'Textbooks', count: 4, pct: 33 },
    { label: 'Research Papers', count: 3, pct: 25 },
    { label: 'Study Guides', count: 2, pct: 17 },
    { label: 'Tutorials', count: 2, pct: 17 },
    { label: 'Reference', count: 1, pct: 8 },
  ];

  return (
    <main className="admin">
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin__overlay" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      {/* Sidebar */}
      <aside className={`admin__sidebar${sidebarOpen ? ' admin__sidebar--open' : ''}`}>
        <div className="admin__brand">
          <span className="admin__brand-icon">🛡</span>
          <span>Read<strong>Space</strong></span>
        </div>
        <nav className="admin__nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin__nav-btn${activeSection === s.id ? ' active' : ''}`}
              onClick={() => handleNavClick(s.id)}
            >
              <span className="admin__nav-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
          <button
            className="admin__nav-btn admin__logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            <span className="admin__nav-icon">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="admin__main">
        {/* Header */}
        <header className="admin__header">
          <div className="admin__header-left">
            <button
              className="admin__hamburger"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              <span /><span /><span />
            </button>
            <h1 className="admin__header-title">{activeSectionLabel}</h1>
          </div>
          <div className="admin__header-right">
            <button
              className="admin__theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="admin__header-user">
              <div className="admin__header-avatar">{user.name.charAt(0)}</div>
              <div>
                <div className="admin__header-name">{user.name}</div>
                <div className="admin__header-role">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">Dashboard Overview</h2>
                <p className="admin__section-sub">Platform health at a glance</p>
              </div>
            </div>

            <div className="admin__stats-grid">
              <StatCard icon="📚" label="Total Resources" value={ANALYTICS.totalResources} delta="↑ 3 this month" color="#1a56db" />
              <StatCard icon="👥" label="Registered Users" value={ANALYTICS.totalUsers.toLocaleString()} delta="↑ 124 this month" color="#10b981" />
              <StatCard icon="⬇" label="Total Downloads" value={ANALYTICS.totalDownloads.toLocaleString()} delta="↑ 8,200 this month" color="#f59e0b" />
              <StatCard icon="🗂" label="Categories" value={ANALYTICS.totalCategories} delta="Active" color="#8b5cf6" />
              <StatCard icon="⭐" label="Avg. Rating" value="4.4" delta="Across all resources" color="#ec4899" />
              <StatCard icon="📝" label="Pending Review" value="3" delta="Needs attention" color="#ef4444" />
            </div>

            <div className="admin__chart-card">
              <h3 className="admin__chart-title">Monthly Downloads</h3>
              <div className="admin__bar-chart">
                {ANALYTICS.monthlyDownloads.map(d => (
                  <div key={d.month} className="admin__bar-col">
                    <span className="admin__bar-value">{(d.value / 1000).toFixed(1)}k</span>
                    <div
                      className="admin__bar"
                      style={{ height: `${(d.value / 14000) * 140}px` }}
                      title={`${d.month}: ${d.value.toLocaleString()}`}
                    />
                    <span className="admin__bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin__quick-table-wrap">
              <h3 className="admin__qt-title">Top 5 Resources by Downloads</h3>
              <table className="admin__table admin__quick-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Downloads</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td>{r.title}</td>
                      <td><span className="cat-tag">{r.categoryLabel}</span></td>
                      <td className="admin__td-num">{r.downloads.toLocaleString()}</td>
                      <td>⭐ {r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── RESOURCES ── */}
        {activeSection === 'resources' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">Manage Resources</h2>
                <p className="admin__section-sub">{resources.length} resources total · {resources.filter(r => r.status === 'published').length} published</p>
              </div>
              <div className="admin__section-actions">
                <input
                  className="admin__search-input form-input"
                  placeholder="Search resources…"
                  value={resSearch}
                  onChange={e => setResSearch(e.target.value)}
                />
                <button className="btn btn--primary btn--sm" onClick={() => handleNavClick('upload')}>+ Upload</button>
              </div>
            </div>

            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Downloads</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resLoading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                    : filteredResources.length === 0
                      ? (
                        <tr>
                          <td colSpan={7}>
                            <EmptyState
                              icon="📭"
                              title="No resources found"
                              sub="Try a different search term."
                            />
                          </td>
                        </tr>
                      )
                      : filteredResources.map(r => (
                        <tr key={r.id}>
                          <td>
                            <div className="admin__table-resource">
                              <img src={r.thumbnail} alt={r.title} className="admin__table-thumb" />
                              <span>{r.title}</span>
                            </div>
                          </td>
                          <td><span className="cat-tag">{r.categoryLabel}</span></td>
                          <td className="admin__td-muted">{r.author}</td>
                          <td>
                            <span className={`admin__status-badge admin__status-badge--${r.status}`}>
                              {r.status === 'published' ? '● Published' : '○ Draft'}
                            </span>
                          </td>
                          <td className="admin__td-num">{r.downloads.toLocaleString()}</td>
                          <td className="admin__td-muted">{r.uploadDate}</td>
                          <td>
                            <div className="admin__row-actions">
                              <button className="admin__icon-btn" title="Preview" onClick={() => showToast(`Previewing "${r.title}"`)}>👁</button>
                              <button className="admin__icon-btn" title="Edit" onClick={() => showToast('Edit form coming soon.')}>✏</button>
                              <button
                                className={`admin__icon-btn admin__icon-btn--toggle${r.status === 'published' ? '' : ' active'}`}
                                title={r.status === 'published' ? 'Set to Draft' : 'Publish'}
                                onClick={() => toggleStatus(r.id)}
                              >
                                {r.status === 'published' ? '⬇' : '⬆'}
                              </button>
                              <button className="admin__icon-btn admin__icon-btn--danger" title="Delete" onClick={() => deleteResource(r.id, r.title)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── UPLOAD ── */}
        {activeSection === 'upload' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">Upload New Resource</h2>
                <p className="admin__section-sub">Add a new document to the ReadSpace library</p>
              </div>
            </div>

            <form className="admin__upload-form" onSubmit={handleUpload} noValidate>
              <p className="admin__form-section-heading">Basic Information</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Resource Title <span className="required">*</span></label>
                  <input
                    className={`form-input${uploadErrors.title ? ' form-input--error' : ''}`}
                    placeholder="e.g. Linear Algebra Done Right"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                  />
                  {uploadErrors.title && <span className="form-error">{uploadErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Author(s) <span className="required">*</span></label>
                  <input
                    className={`form-input${uploadErrors.author ? ' form-input--error' : ''}`}
                    placeholder="e.g. Sheldon Axler"
                    value={uploadForm.author}
                    onChange={e => setUploadForm(f => ({ ...f, author: e.target.value }))}
                  />
                  {uploadErrors.author && <span className="form-error">{uploadErrors.author}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Category</label>
                  <select className="form-input form-select" value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="textbooks">Textbook</option>
                    <option value="research">Research Paper</option>
                    <option value="guides">Study Guide</option>
                    <option value="tutorials">Tutorial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Publication Year</label>
                  <input className="form-input" type="number" min="1900" max="2030" value={uploadForm.year} onChange={e => setUploadForm(f => ({ ...f, year: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Tags <span className="form-hint">(comma-separated)</span></label>
                  <input className="form-input" placeholder="e.g. algebra, mathematics, beginner" value={uploadForm.tags} onChange={e => setUploadForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Status</label>
                  <select className="form-input form-select" value={uploadForm.status} onChange={e => setUploadForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="draft">Draft (hidden)</option>
                    <option value="published">Published (live)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label admin__form-group-label">Description <span className="required">*</span></label>
                <textarea
                  className={`form-input form-textarea${uploadErrors.description ? ' form-input--error' : ''}`}
                  rows={4}
                  placeholder="Brief description of the resource…"
                  value={uploadForm.description}
                  onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                />
                {uploadErrors.description && <span className="form-error">{uploadErrors.description}</span>}
              </div>

              <p className="admin__form-section-heading">File & Media</p>
              <div className="form-group">
                <label className="form-label admin__form-group-label">Upload File</label>
                <div className="admin__file-drop">
                  <span className="admin__file-drop-icon">📁</span>
                  <span>Drag &amp; drop <strong>PDF</strong> or <strong>EPUB</strong> here</span>
                  <span className="admin__file-hint">or <label className="admin__file-browse">browse files<input type="file" className="admin__file-input" accept=".pdf,.epub" /></label></span>
                  <span className="admin__file-hint">Max file size: 25 MB</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label admin__form-group-label">Thumbnail URL <span className="form-hint">(optional)</span></label>
                <input className="form-input" type="url" placeholder="https://example.com/cover.jpg" />
              </div>

              <div className="admin__upload-footer">
                <button type="button" className="btn btn--outline" onClick={() => { setUploadForm(INITIAL_UPLOAD); setUploadErrors({}); }}>Reset</button>
                <button type="submit" className="btn btn--primary btn--lg" disabled={uploadLoading}>
                  {uploadLoading ? <span className="admin__spinner" /> : '⬆'} {uploadLoading ? 'Uploading…' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ── USERS ── */}
        {activeSection === 'users' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">User Management</h2>
                <p className="admin__section-sub">{users.length} users · {users.filter(u => u.status === 'active').length} active</p>
              </div>
              <div className="admin__section-actions">
                <input
                  className="admin__search-input form-input"
                  placeholder="Search users…"
                  value={usrSearch}
                  onChange={e => setUsrSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Downloads</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resLoading
                    ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                    : filteredUsers.length === 0
                      ? (
                        <tr>
                          <td colSpan={7}>
                            <EmptyState icon="👤" title="No users found" sub="Try a different search." />
                          </td>
                        </tr>
                      )
                      : filteredUsers.map(u => (
                        <tr key={u.id} className={u.status === 'inactive' ? 'admin__row--disabled' : ''}>
                          <td>
                            <div className="admin__table-user">
                              <div className="admin__user-avatar">{u.name.charAt(0)}</div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td className="admin__td-muted">{u.email}</td>
                          <td>
                            <select
                              className="admin__role-select"
                              value={u.role}
                              onChange={e => changeRole(u.id, e.target.value)}
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="admin__td-muted">{u.joined}</td>
                          <td className="admin__td-num">{u.downloads}</td>
                          <td><span className={`status-tag status-tag--${u.status}`}>{u.status}</span></td>
                          <td>
                            <button
                              className={`admin__icon-btn${u.status === 'active' ? ' admin__icon-btn--danger' : ' admin__icon-btn--success'}`}
                              title={u.status === 'active' ? 'Disable account' : 'Enable account'}
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status === 'active' ? '🚫' : '✅'}
                            </button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── ANALYTICS ── */}
        {activeSection === 'analytics' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">Analytics</h2>
                <p className="admin__section-sub">Usage trends and content performance</p>
              </div>
            </div>

            <div className="admin__stats-grid">
              <StatCard icon="⬇" label="Total Downloads" value={ANALYTICS.totalDownloads.toLocaleString()} delta="All time" color="#1a56db" />
              <StatCard icon="📅" label="This Month" value="12,400" delta="↑ 14% vs last month" color="#10b981" />
              <StatCard icon="👁" label="Page Views" value="98,230" delta="↑ 22% this month" color="#f59e0b" />
              <StatCard icon="🔄" label="Return Rate" value="68%" delta="Users coming back" color="#8b5cf6" />
            </div>

            <div className="admin__chart-card">
              <h3 className="admin__chart-title">Monthly Download Trend</h3>
              <div className="admin__bar-chart">
                {ANALYTICS.monthlyDownloads.map(d => (
                  <div key={d.month} className="admin__bar-col">
                    <span className="admin__bar-value">{(d.value / 1000).toFixed(1)}k</span>
                    <div
                      className="admin__bar"
                      style={{ height: `${(d.value / 14000) * 140}px` }}
                      title={`${d.month}: ${d.value.toLocaleString()}`}
                    />
                    <span className="admin__bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin__chart-card">
              <h3 className="admin__chart-title">Downloads by Category</h3>
              <div className="admin__cat-breakdown">
                {catBreakdown.map(c => (
                  <div key={c.label} className="admin__cat-row">
                    <div className="admin__cat-meta">
                      <span className="admin__cat-label">{c.label}</span>
                      <span className="admin__cat-count">{c.count} resources · {c.pct}%</span>
                    </div>
                    <div className="admin__cat-bar-bg">
                      <div className="admin__cat-bar-fill" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SETTINGS ── */}
        {activeSection === 'settings' && (
          <section className="admin__section">
            <div className="admin__section-header">
              <div>
                <h2 className="admin__section-title">Platform Settings</h2>
                <p className="admin__section-sub">Configure global ReadSpace behaviour</p>
              </div>
            </div>

            <form className="admin__upload-form" onSubmit={e => { e.preventDefault(); showToast('Settings saved.'); }} style={{ maxWidth: 560 }}>
              <p className="admin__form-section-heading">General</p>

              <div className="form-group">
                <label className="form-label admin__form-group-label">Site Name</label>
                <input className="form-input" value={settings.siteName} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Max Upload Size (MB)</label>
                  <input className="form-input" type="number" min="1" max="500" value={settings.maxFileSize} onChange={e => setSettings(s => ({ ...s, maxFileSize: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label admin__form-group-label">Default Category</label>
                  <select className="form-input form-select" value={settings.defaultCategory} onChange={e => setSettings(s => ({ ...s, defaultCategory: e.target.value }))}>
                    <option value="textbooks">Textbooks</option>
                    <option value="research">Research Papers</option>
                    <option value="guides">Study Guides</option>
                    <option value="tutorials">Tutorials</option>
                  </select>
                </div>
              </div>

              <p className="admin__form-section-heading">Access Control</p>

              <div className="admin__toggle-row">
                <div>
                  <div className="admin__toggle-label">Maintenance Mode</div>
                  <div className="admin__toggle-sub">Show a maintenance page to non-admin visitors</div>
                </div>
                <label className="admin__switch">
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings(s => ({ ...s, maintenanceMode: e.target.checked }))} />
                  <span className="admin__switch-track" />
                </label>
              </div>

              <div className="admin__toggle-row">
                <div>
                  <div className="admin__toggle-label">Allow New Registrations</div>
                  <div className="admin__toggle-sub">Let new users create accounts</div>
                </div>
                <label className="admin__switch">
                  <input type="checkbox" checked={settings.allowRegistrations} onChange={e => setSettings(s => ({ ...s, allowRegistrations: e.target.checked }))} />
                  <span className="admin__switch-track" />
                </label>
              </div>

              <div className="admin__upload-footer">
                <button type="submit" className="btn btn--primary">Save Settings</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
