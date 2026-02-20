import './CategoryFilter.css';
import { CATEGORIES } from '../../data/mockData';

export default function CategoryFilter({ active, onSelect }) {
  return (
    <div className="cat-filter" role="list" aria-label="Category filters">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          role="listitem"
          className={`cat-filter__btn${active === cat.id ? ' active' : ''}`}
          onClick={() => onSelect(cat.id)}
          aria-pressed={active === cat.id}
        >
          <span className="cat-filter__icon">{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
