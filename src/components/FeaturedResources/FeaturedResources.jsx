import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../ResourceCard/ResourceCard';
import PreviewModal from '../PreviewModal/PreviewModal';
import FeedbackForm from '../FeedbackForm/FeedbackForm';
import { RESOURCES } from '../../data/mockData';
import './FeaturedResources.css';

// Top 6 resources marked as featured
const FEATURED = RESOURCES.filter(r => r.featured).slice(0, 6);

export default function FeaturedResources() {
  const navigate = useNavigate();
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  return (
    <section className="featured-resources">
      <div className="container">
        {/* Section header */}
        <div className="featured-resources__header">
          <div>
            <span className="featured-resources__eyebrow">⭐ Curated for You</span>
            <h2 className="featured-resources__title">Featured Resources</h2>
            <p className="featured-resources__sub">
              Hand-picked by our editorial team — the most impactful materials in every category.
            </p>
          </div>
          <button
            className="btn btn--outline btn--sm featured-resources__view-all"
            onClick={() => navigate('/home')}
          >
            View all →
          </button>
        </div>

        {/* Card grid */}
        <div className="featured-resources__grid">
          {FEATURED.map(r => (
            <ResourceCard
              key={r.id}
              resource={r}
              onPreview={setPreviewResource}
              onFeedback={setFeedbackResource}
            />
          ))}
        </div>
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
