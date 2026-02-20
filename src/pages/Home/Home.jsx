import { useState, useMemo } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ResourceCard from '../../components/ResourceCard/ResourceCard';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import { RESOURCES } from '../../data/mockData';
import './Home.css';

export default function Home() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [previewResource, setPreviewResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      const matchCat = category === 'all' || r.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.tags.some(t => t.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <main className="home">
      <HeroSection />

      {/* Search & Filter bar */}
      <section className="home__filter-bar">
        <div className="container home__filter-inner">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author or tag…" />
          <CategoryFilter active={category} onSelect={setCategory} />
        </div>
      </section>

      {/* Resource Grid */}
      <section className="home__grid-section">
        <div className="container">
          <div className="home__grid-header">
            <h2 className="section-title">
              {category === 'all' ? 'All Resources' : `${RESOURCES.find(r => r.category === category)?.categoryLabel || category}s`}
              <span className="section-count">{filtered.length} found</span>
            </h2>
          </div>

          {filtered.length > 0 ? (
            <div className="resource-grid">
              {filtered.map(r => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  onPreview={setPreviewResource}
                  onFeedback={setFeedbackResource}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3>No resources found</h3>
              <p>Try a different search term or browse all categories.</p>
              <button className="btn btn--primary" onClick={() => { setSearch(''); setCategory('all'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {previewResource && (
        <PreviewModal resource={previewResource} onClose={() => setPreviewResource(null)} />
      )}
      {feedbackResource && (
        <FeedbackForm resource={feedbackResource} onClose={() => setFeedbackResource(null)} />
      )}
    </main>
  );
}
