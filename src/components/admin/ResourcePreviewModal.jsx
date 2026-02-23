import { useEffect } from 'react';
import './admin-components.css';

export default function ResourcePreviewModal({ resource, onClose }) {
  // ESC key handler
  useEffect(() => {
    const hk = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', hk);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', hk);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!resource) return null;

  return (
    <div
      className="adm-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${resource.title}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="adm-modal adm-modal--preview">
        <header className="adm-modal__header">
          <h2 className="adm-modal__title">Resource Preview</h2>
          <button
            className="adm-modal__close"
            onClick={onClose}
            aria-label="Close preview"
          >
            ✕
          </button>
        </header>

        <div className="adm-preview__body">
          <div className="adm-preview__hero">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="adm-preview__thumb"
            />
            <div className="adm-preview__meta">
              <span className={`admin__status-badge admin__status-badge--${resource.status}`}>
                {resource.status === 'published' ? '● Published' : '○ Draft'}
              </span>
              <h3 className="adm-preview__resource-title">{resource.title}</h3>
              <p className="adm-preview__author">by {resource.author}</p>
              <div className="adm-preview__tags">
                {(resource.tags || []).map(tag => (
                  <span key={tag} className="adm-preview__tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="adm-preview__desc">
            <h4 className="adm-preview__desc-label">Description</h4>
            <p>{resource.description}</p>
          </div>

          <div className="adm-preview__stats">
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">🗂</span>
              <div>
                <div className="adm-preview__stat-label">Category</div>
                <div className="adm-preview__stat-value">{resource.categoryLabel}</div>
              </div>
            </div>
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">📅</span>
              <div>
                <div className="adm-preview__stat-label">Year</div>
                <div className="adm-preview__stat-value">{resource.year}</div>
              </div>
            </div>
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">📄</span>
              <div>
                <div className="adm-preview__stat-label">Pages</div>
                <div className="adm-preview__stat-value">{resource.pages ?? '—'}</div>
              </div>
            </div>
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">💾</span>
              <div>
                <div className="adm-preview__stat-label">File Size</div>
                <div className="adm-preview__stat-value">{resource.fileSize ?? '—'}</div>
              </div>
            </div>
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">⭐</span>
              <div>
                <div className="adm-preview__stat-label">Rating</div>
                <div className="adm-preview__stat-value">{resource.rating} / 5.0</div>
              </div>
            </div>
            <div className="adm-preview__stat">
              <span className="adm-preview__stat-icon">⬇</span>
              <div>
                <div className="adm-preview__stat-label">Downloads</div>
                <div className="adm-preview__stat-value">{(resource.downloads || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <footer className="adm-modal__footer">
          <button className="btn btn--outline" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
