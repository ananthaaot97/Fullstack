import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search resources…' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`search-bar${focused ? ' search-bar--focused' : ''}`}>
      <span className="search-bar__icon" aria-hidden>🔍</span>
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
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
