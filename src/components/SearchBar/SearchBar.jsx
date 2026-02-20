import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search resources…',
  showFilter = false,
  onFilter,
  filterActive = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`search-bar${focused ? ' search-bar--focused' : ''}${showFilter ? ' search-bar--pill' : ''}`}>
      {/* SVG search icon */}
      <span className="search-bar__icon" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </span>

      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Search resources"
      />

      {/* Clear button — shown only when there is text */}
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}

      {/* Filter button — only shown when showFilter=true */}
      {showFilter && (
        <button
          className={`search-bar__filter-btn${filterActive ? ' active' : ''}`}
          onClick={onFilter}
          type="button"
          aria-label="Toggle filters"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filter
        </button>
      )}
    </div>
  );
}
