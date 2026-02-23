import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { RESOURCES, MOCK_USERS, ANALYTICS } from '../../data/mockData';
import ResourcePreviewModal from '../../components/admin/ResourcePreviewModal';
import EditResourceModal from '../../components/admin/EditResourceModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import RecentActivity from '../../components/admin/RecentActivity';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  LayoutDashboard, BookOpen, Upload, Users, BarChart2, Settings, LogOut,
  ShieldCheck, Menu, Sun, Moon, Eye, Pencil, Globe, EyeOff, Trash2,
  ArrowDownToLine, Layers, Star, AlertCircle, Calendar, ChevronDown, X,
  CheckCircle,
} from 'lucide-react';
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

function StatCard({ Icon, label, value, delta, color }) {
  return (
    <div className="admin__stat-card">
      <div className="admin__stat-icon" style={{ background: color + '1a', color }}>
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div className="admin__stat-body">
        <span className="admin__stat-label">{label}</span>
        <span className="admin__stat-value">{value}</span>
        {delta && <span className="admin__stat-delta">{delta}</span>}
      </div>
    </div>
  );
}

function ActionBtn({ Icon: IconComp, label, tooltip, variant, onClick }) {
  return (
    <button
      className={`admin__action-btn${variant ? ` admin__action-btn--${variant}` : ''}`}
      onClick={onClick}
      aria-label={label}
      data-tip={tooltip}
    >
      <IconComp size={16} strokeWidth={2} />
    </button>
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
  { id: 'overview',   label: 'Overview',         Icon: LayoutDashboard },
  { id: 'resources',  label: 'Resources',         Icon: BookOpen },
  { id: 'upload',     label: 'Upload Resource',   Icon: Upload },
  { id: 'users',      label: 'Users',             Icon: Users },
  { id: 'analytics',  label: 'Analytics',         Icon: BarChart2 },
  { id: 'settings',   label: 'Settings',          Icon: Settings },
];

const DATE_RANGES = [
  { value: 'last7',    label: 'Last 7 days' },
  { value: 'last30',   label: 'Last 30 days' },
  { value: 'thisyear', label: 'This year' },
];

const INITIAL_ACTIVITIES = [
  { id: 1, iconType: 'upload',        text: 'Resource "Introduction to Algorithms" published', type: 'success', time: '09:14' },
  { id: 2, iconType: 'user_register', text: 'New user Ananya Sharma registered',               type: 'info',    time: '08:52' },
  { id: 3, iconType: 'download',      text: '"React & Next.js Tutorial" downloaded 50× today', type: 'info',    time: '08:30' },
  { id: 4, iconType: 'edit',          text: 'Resource "Deep Learning with Python" edited',     type: 'warning', time: 'Yesterday' },
  { id: 5, iconType: 'user_disable',  text: 'User Vikram Singh account disabled',              type: 'error',   time: 'Yesterday' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toastCounter = useRef(0);
  const activityCounter = useRef(5); // starts after INITIAL_ACTIVITIES

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

  // Modals / dialogs
  const [previewResource, setPreviewResource] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title }

  // Activity feed
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Date range filter
  const [dateRange, setDateRange] = useState('last30');

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

  const addActivity = (text, iconType = 'default', type = 'info') => {
    activityCounter.current += 1;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities(prev => [{ id: activityCounter.current, iconType, text, type, time: now, isNew: true }, ...prev].slice(0, 20));
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
    const res = resources.find(r => r.id === id);
    const newStatus = res?.status === 'published' ? 'draft' : 'published';
    setResources(rs => rs.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Resource set to ${newStatus}.`);
    if (res) addActivity(`"${res.title}" set to ${newStatus}`, newStatus === 'published' ? 'status_pub' : 'status_draft', newStatus === 'published' ? 'success' : 'warning');
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    setResources(rs => rs.filter(r => r.id !== confirmDelete.id));
    showToast(`"${confirmDelete.title}" deleted.`, 'error');
    addActivity(`Resource "${confirmDelete.title}" deleted`, 'delete', 'error');
    setConfirmDelete(null);
  };

  const handleSaveEdit = (updated) => {
    setResources(rs => rs.map(r => r.id === updated.id ? updated : r));
    setEditResource(null);
    showToast(`"${updated.title}" updated successfully.`);
    addActivity(`Resource "${updated.title}" edited`, 'edit', 'warning');
  };

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(resSearch.toLowerCase()) ||
    r.categoryLabel.toLowerCase().includes(resSearch.toLowerCase())
  );

  /* ── User actions ── */
  const toggleUserStatus = (id) => {
    const u = users.find(u => u.id === id);
    const newStatus = u?.status === 'active' ? 'inactive' : 'active';
    setUsers(us => us.map(u => u.id === id ? { ...u, status: newStatus } : u));
    showToast('User status updated.');
    if (u) addActivity(`User "${u.name}" ${newStatus === 'active' ? 'enabled' : 'disabled'}`, newStatus === 'active' ? 'user_enable' : 'user_disable', newStatus === 'active' ? 'success' : 'error');
  };

  const changeRole = (id, role) => {
    const u = users.find(u => u.id === id);
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    showToast('Role updated.');
    if (u) addActivity(`User "${u.name}" role changed to ${role}`, 'role_change', 'info');
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
    addActivity(`Resource "${uploadForm.title}" uploaded`, 'upload', 'success');
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

      {/* ── Modals & Dialogs ── */}
      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
      {editResource && (
        <EditResourceModal
          resource={editResource}
          onSave={handleSaveEdit}
          onClose={() => setEditResource(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Resource"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin__overlay" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      {/* Sidebar */}
      <aside className={`admin__sidebar${sidebarOpen ? ' admin__sidebar--open' : ''}`}>
        <div className="admin__brand">
          <ShieldCheck size={20} strokeWidth={2} className="admin__brand-icon-svg" />
          <span>Read<strong>Space</strong></span>
        </div>
        <nav className="admin__nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin__nav-btn${activeSection === s.id ? ' active' : ''}`}
              onClick={() => handleNavClick(s.id)}
            >
              <s.Icon size={16} strokeWidth={2} className="admin__nav-icon-svg" />
              {s.label}
            </button>
          ))}
          <button
            className="admin__nav-btn admin__logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut size={16} strokeWidth={2} className="admin__nav-icon-svg" />
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
              <Menu size={20} strokeWidth={2} />
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
              {theme === 'light' ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
            </button>
          </div>
        </header>

        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <section className="admin__section">
            <AdminPageHeader
              title="Overview"
              subtitle="Monitor platform performance and activity"
            >
              <div className="admin__date-range">
                <Calendar size={14} strokeWidth={2} className="admin__date-icon" />
                <select
                  className="admin__date-select"
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  aria-label="Date range"
                >
                  {DATE_RANGES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <ChevronDown size={12} strokeWidth={2.5} className="admin__date-chevron" />
              </div>
            </AdminPageHeader>

            <div className="admin__stats-grid">
              <StatCard Icon={BookOpen}         label="Total Resources"  value={ANALYTICS.totalResources} delta="↑ 3 this month" color="#1a56db" />
              <StatCard Icon={Users}            label="Registered Users" value={ANALYTICS.totalUsers.toLocaleString()} delta="↑ 124 this month" color="#10b981" />
              <StatCard Icon={ArrowDownToLine}  label="Total Downloads"  value={ANALYTICS.totalDownloads.toLocaleString()} delta="↑ 8,200 this month" color="#f59e0b" />
              <StatCard Icon={Layers}           label="Categories"       value={ANALYTICS.totalCategories} delta="Active" color="#8b5cf6" />
              <StatCard Icon={Star}             label="Avg. Rating"      value="4.4" delta="Across all resources" color="#ec4899" />
              <StatCard Icon={AlertCircle}      label="Pending Review"   value="3" delta="Needs attention" color="#ef4444" />
            </div>

            <RecentActivity activities={activities} />

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
            <AdminPageHeader
              title="Manage Resources"
              subtitle={`${resources.length} resources total · ${resources.filter(r => r.status === 'published').length} published`}
            >
              <div className="admin__section-actions">
                <input
                  className="admin__search-input form-input"
                  placeholder="Search resources…"
                  value={resSearch}
                  onChange={e => setResSearch(e.target.value)}
                />
                <button className="btn btn--primary btn--sm" onClick={() => handleNavClick('upload')}>+ Upload</button>
              </div>
            </AdminPageHeader>

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
                              {r.status === 'published'
                                ? <><CheckCircle size={11} strokeWidth={2.5} style={{ marginRight: 4 }} />Published</>
                                : <><EyeOff size={11} strokeWidth={2} style={{ marginRight: 4 }} />Draft</>}
                            </span>
                          </td>
                          <td className="admin__td-num">{r.downloads.toLocaleString()}</td>
                          <td className="admin__td-muted">{r.uploadDate}</td>
                          <td>
                            <div className="admin__row-actions">
                              <ActionBtn
                                Icon={Eye}
                                label={`Preview ${r.title}`}
                                tooltip="View resource"
                                onClick={() => setPreviewResource(r)}
                              />
                              <ActionBtn
                                Icon={Pencil}
                                label={`Edit ${r.title}`}
                                tooltip="Edit resource"
                                onClick={() => setEditResource(r)}
                              />
                              <ActionBtn
                                Icon={r.status === 'published' ? EyeOff : Globe}
                                label={r.status === 'published' ? `Set ${r.title} to draft` : `Publish ${r.title}`}
                                tooltip={r.status === 'published' ? 'Set to Draft' : 'Publish'}
                                variant={r.status === 'published' ? 'toggle' : 'toggle-active'}
                                onClick={() => toggleStatus(r.id)}
                              />
                              <ActionBtn
                                Icon={Trash2}
                                label={`Delete ${r.title}`}
                                tooltip="Delete resource"
                                variant="danger"
                                onClick={() => setConfirmDelete({ id: r.id, title: r.title })}
                              />
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
            <AdminPageHeader
              title="Upload New Resource"
              subtitle="Add a new document to the ReadSpace library"
            />

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
                  {uploadLoading ? <span className="admin__spinner" /> : <Upload size={15} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                  {' '}{uploadLoading ? 'Uploading…' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ── USERS ── */}
        {activeSection === 'users' && (
          <section className="admin__section">
            <AdminPageHeader
              title="User Management"
              subtitle={`${users.length} users · ${users.filter(u => u.status === 'active').length} active`}
            >
              <div className="admin__section-actions">
                <input
                  className="admin__search-input form-input"
                  placeholder="Search users…"
                  value={usrSearch}
                  onChange={e => setUsrSearch(e.target.value)}
                />
              </div>
            </AdminPageHeader>

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
                                className={`admin__action-btn${u.status === 'active' ? ' admin__action-btn--danger' : ' admin__action-btn--success'}`}
                                title={u.status === 'active' ? 'Disable account' : 'Enable account'}
                                aria-label={u.status === 'active' ? `Disable ${u.name}` : `Enable ${u.name}`}
                                data-tip={u.status === 'active' ? 'Disable account' : 'Enable account'}
                                onClick={() => toggleUserStatus(u.id)}
                              >
                                {u.status === 'active'
                                  ? <EyeOff size={15} strokeWidth={2} />
                                  : <CheckCircle size={15} strokeWidth={2} />}
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
            <AdminPageHeader
              title="Analytics"
              subtitle="Usage trends and content performance"
            />

            <div className="admin__stats-grid">
              <StatCard Icon={ArrowDownToLine} label="Total Downloads" value={ANALYTICS.totalDownloads.toLocaleString()} delta="All time" color="#1a56db" />
              <StatCard Icon={Calendar}        label="This Month"      value="12,400" delta="↑ 14% vs last month" color="#10b981" />
              <StatCard Icon={Eye}             label="Page Views"      value="98,230" delta="↑ 22% this month" color="#f59e0b" />
              <StatCard Icon={CheckCircle}     label="Return Rate"     value="68%" delta="Users coming back" color="#8b5cf6" />
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
            <AdminPageHeader
              title="Platform Settings"
              subtitle="Configure global ReadSpace behaviour"
            />

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
