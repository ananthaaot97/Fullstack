import { useState } from 'react';
import ResourceCard from '../../components/ResourceCard/ResourceCard';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { RESOURCES } from '../../data/mockData';
import './Popular.css';

const sorted = [...RESOURCES].sort((a, b) => b.downloads - a.downloads);

export default function Popular() {
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  return (
    <main>
      <section className="page-hero page-hero--fire">
        <div className="container">
          <h1 className="page-hero__title">🔥 Most Popular Resources</h1>
          <p className="page-hero__sub">Ranked by total community downloads.</p>
        </div>
      </section>

      {/* Top 3 spotlight */}
      <section className="popular__spotlight">
        <div className="container">
          <h2 className="section-title">🏆 Top Picks</h2>
          <div className="popular__podium">
            {sorted.slice(0, 3).map((r, i) => (
              <div key={r.id} className={`popular__podium-item popular__podium-item--${i + 1}`}>
                <span className="popular__rank">{['🥇', '🥈', '🥉'][i]}</span>
                <img src={r.thumbnail} alt={r.title} className="popular__podium-img" />
                <h3>{r.title}</h3>
                <p className="popular__podium-downloads">⬇ {r.downloads.toLocaleString()} downloads</p>
                <div className="popular__podium-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => setPreviewResource(r)}>👁 Preview</button>
                  <button className="btn btn--primary btn--sm" onClick={() => alert('Download started! (mock)')}>⬇ Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All sorted */}
      <section className="popular__all">
        <div className="container">
          <h2 className="section-title">All Resources by Popularity<span className="section-count">{sorted.length}</span></h2>
          <div className="resource-grid">
            {sorted.map(r => (
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
