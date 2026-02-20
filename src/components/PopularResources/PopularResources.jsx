import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../ResourceCard/ResourceCard';
import PreviewModal from '../PreviewModal/PreviewModal';
import FeedbackForm from '../FeedbackForm/FeedbackForm';
import { RESOURCES } from '../../data/mockData';
import './PopularResources.css';

// Top 6 by total downloads
const POPULAR = [...RESOURCES]
  .sort((a, b) => b.downloads - a.downloads)
  .slice(0, 6);

export default function PopularResources() {
  const navigate = useNavigate();
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  return (
    <section className="popular-resources">
      <div className="popular-resources__header">
        <div>
          <span className="popular-resources__eyebrow">🔥 Community Favourites</span>
          <h2 className="popular-resources__title">Popular Resources</h2>
          <p className="popular-resources__sub">
            Ranked by total downloads — the resources your peers trust most.
          </p>
        </div>
        <button
          className="btn btn--outline btn--sm popular-resources__view-all"
          onClick={() => navigate('/popular')}
        >
          See full ranking →
        </button>
      </div>

      <div className="popular-resources__grid">
        {POPULAR.map((r, i) => (
          <div key={r.id} className="popular-resources__item">
            {/* Rank badge */}
            <div
              className={`popular-resources__rank popular-resources__rank--${i < 3 ? i + 1 : 'other'}`}
              aria-label={`Rank ${i + 1}`}
            >
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </div>
            <ResourceCard
              resource={r}
              onPreview={setPreviewResource}
              onFeedback={setFeedbackResource}
            />
          </div>
        ))}
      </div>

      {previewResource && (
        <PreviewModal resource={previewResource} onClose={() => setPreviewResource(null)} />
      )}
      {feedbackResource && (
        <FeedbackForm resource={feedbackResource} onClose={() => setFeedbackResource(null)} />
      )}
    </section>
  );
}
