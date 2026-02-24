import { useState } from 'react';
import { FileText, Calendar, Download, Eye, MessageSquare, Loader2 } from 'lucide-react';
import './ResourceCard.css';

const CATEGORY_COLORS = {
  textbooks: '#3b82f6',
  research:  '#8b5cf6',
  guides:    '#10b981',
  tutorials: '#f59e0b',
};

export default function ResourceCard({ resource, onPreview, onFeedback }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`"${resource.title}" download started!\n(Mock action – no actual file)`);    }, 1200);
  };

  const color = CATEGORY_COLORS[resource.category] || '#1a56db';
  const stars = '★'.repeat(Math.round(resource.rating)) + '☆'.repeat(5 - Math.round(resource.rating));

  return (
    <article className="resource-card">
      {/* Thumbnail */}
      <div className="resource-card__thumb-wrap">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="resource-card__thumb"
          loading="lazy"
        />
        <span
          className="resource-card__badge"
          style={{ background: color }}
        >
          {resource.categoryLabel}
        </span>
      </div>

      {/* Body */}
      <div className="resource-card__body">
        <h3 className="resource-card__title">{resource.title}</h3>
        <p className="resource-card__author">by {resource.author}</p>
        <p className="resource-card__desc">{resource.description}</p>

        <div className="resource-card__meta">
          <span title="Rating" className="resource-card__stars" style={{ color }}>
            {stars}
          </span>
          <span className="resource-card__meta-item"><FileText size={12} aria-hidden="true" /> {resource.pages}pp</span>
          <span className="resource-card__meta-item"><Calendar size={12} aria-hidden="true" /> {resource.year}</span>
          <span className="resource-card__meta-item"><Download size={12} aria-hidden="true" /> {resource.downloads.toLocaleString()}</span>
          <span className="resource-card__meta-item">{resource.fileSize}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="resource-card__actions">
        <button
          className="btn btn--outline btn--sm"
          onClick={() => onPreview(resource)}
        >
          <Eye size={14} aria-hidden="true" /> Preview
        </button>
        <button
          className="btn btn--primary btn--sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? <><Loader2 size={14} aria-hidden="true" className="spin" /> Downloading…</> : <><Download size={14} aria-hidden="true" /> Download</>}
        </button>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onFeedback(resource)}
        >
          <MessageSquare size={14} aria-hidden="true" /> Feedback
        </button>
      </div>
    </article>
  );
}
