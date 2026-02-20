import { useState } from 'react';
import ResourceCard from '../../components/ResourceCard/ResourceCard';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { RESOURCES } from '../../data/mockData';
import './Latest.css';

const latestResources = RESOURCES.filter(r => r.latest).sort((a, b) => b.year - a.year);
const allByYear = [...RESOURCES].sort((a, b) => b.year - a.year);

export default function Latest() {
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  return (
    <main>
      <section className="page-hero page-hero--green">
        <div className="container">
          <h1 className="page-hero__title">🆕 Latest Additions</h1>
          <p className="page-hero__sub">Freshly added resources — curated and ready to download.</p>
        </div>
      </section>

      {/* Newest highlights */}
      <section className="latest__highlights">
        <div className="container">
          <h2 className="section-title">✨ New This Month<span className="section-count">{latestResources.length}</span></h2>
          <div className="resource-grid" style={{ marginTop: '1.25rem' }}>
            {latestResources.map(r => (
              <ResourceCard key={r.id} resource={r} onPreview={setPreviewResource} onFeedback={setFeedbackResource} />
            ))}
          </div>
        </div>
      </section>

      {/* All sorted by year */}
      <section className="latest__all">
        <div className="container">
          <h2 className="section-title">All Resources by Year<span className="section-count">{allByYear.length}</span></h2>
          <div className="resource-grid">
            {allByYear.map(r => (
              <ResourceCard key={r.id} resource={r} onPreview={setPreviewResource} onFeedback={setFeedbackResource} />
            ))}
          </div>
        </div>
      </section>

      {previewResource && <PreviewModal resource={previewResource} onClose={() => setPreviewResource(null)} />}
      {feedbackResource && <FeedbackForm resource={feedbackResource} onClose={() => setFeedbackResource(null)} />}
    </main>
  );
}
