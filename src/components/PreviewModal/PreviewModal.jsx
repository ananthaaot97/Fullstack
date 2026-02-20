import { useEffect } from 'react';
import './PreviewModal.css';

export default function PreviewModal({ resource, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Resource preview">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close modal">✕</button>

        <div className="modal__header">
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="modal__thumb"
          />
          <div>
            <span className="modal__category-badge">{resource.categoryLabel}</span>
            <h2 className="modal__title">{resource.title}</h2>
            <p className="modal__author">by {resource.author} • {resource.year}</p>
          </div>
        </div>

        <div className="modal__body">
          <section>
            <h3>About this resource</h3>
            <p>{resource.description}</p>
          </section>

          <div className="modal__stats">
            <div className="modal__stat">
              <strong>{resource.pages}</strong>
              <span>Pages</span>
            </div>
            <div className="modal__stat">
              <strong>{resource.rating}/5</strong>
              <span>Rating</span>
            </div>
            <div className="modal__stat">
              <strong>{resource.downloads.toLocaleString()}</strong>
              <span>Downloads</span>
            </div>
            <div className="modal__stat">
              <strong>{resource.fileSize}</strong>
              <span>File Size</span>
            </div>
          </div>

          <div className="modal__tags">
            {resource.tags.map(tag => (
              <span key={tag} className="modal__tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="modal__footer">
          <button
            className="btn btn--primary btn--lg"
            onClick={() => alert(`✅ Download started for "${resource.title}" (mock action)`)}
          >
            ⬇ Download Now
          </button>
          <button className="btn btn--secondary btn--lg" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
