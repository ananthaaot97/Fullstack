/**
 * RatingsContext — global shared store for resource reviews & ratings.
 *
 * Persists to localStorage so reviews survive page refreshes.
 * Both FeedbackForm (student) and AdminDashboard (admin) consume this.
 *
 * Shape of stored data:
 *   reviewsByResource: { [resourceId]: Review[] }
 *
 * Review shape:
 *   { id, resourceId, name, initials, rating, text, date, color, isNew? }
 */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'readspace_reviews_v1';

/* ── Seed reviews that appear by default in every resource ── */
const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'Priya Nair',
    initials: 'PN',
    rating: 5,
    text: 'Absolutely essential for any CS student. Covers every topic in depth with clear examples and worked problems. My go-to reference.',
    date: 'Feb 2026',
    color: '#8b5cf6',
  },
  {
    id: 'seed-2',
    name: 'Rahul Verma',
    initials: 'RV',
    rating: 4,
    text: 'The explanations are incredibly thorough. I especially appreciated the complexity analysis sections. Worth every page.',
    date: 'Jan 2026',
    color: '#10b981',
  },
  {
    id: 'seed-3',
    name: 'Ananya Sharma',
    initials: 'AS',
    rating: 4,
    text: 'Very comprehensive. Some sections could use more visual diagrams, but overall one of the best resources available.',
    date: 'Dec 2025',
    color: '#f59e0b',
  },
];

/* ── Load from localStorage ── */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/* ── Save to localStorage ── */
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — silently skip
  }
}

/* ── Context ── */
const RatingsContext = createContext(null);

export function RatingsProvider({ children }) {
  // Each key is a resourceId; value is array of user-submitted reviews
  const [reviewsByResource, setReviewsByResource] = useState(loadFromStorage);

  /* Add a new review for a resource */
  const addReview = useCallback((resourceId, review) => {
    setReviewsByResource(prev => {
      const existing = prev[resourceId] ?? [];
      const updated = { ...prev, [resourceId]: [review, ...existing] };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /* Get all reviews for a resource (seed + user-submitted) */
  const getReviews = useCallback((resourceId) => {
    const userReviews = reviewsByResource[resourceId] ?? [];
    return [...userReviews, ...SEED_REVIEWS];
  }, [reviewsByResource]);

  /* Compute average rating for a resource, blending seed + user reviews */
  const getAvgRating = useCallback((resourceId, baseRating) => {
    const userReviews = reviewsByResource[resourceId] ?? [];
    if (userReviews.length === 0) return baseRating;
    const allRatings = [
      ...userReviews.map(r => r.rating),
      ...SEED_REVIEWS.map(r => r.rating),
      baseRating,
    ];
    const avg = allRatings.reduce((s, r) => s + r, 0) / allRatings.length;
    return Math.round(avg * 10) / 10;
  }, [reviewsByResource]);

  /* Count of user-submitted reviews for a resource */
  const getUserReviewCount = useCallback((resourceId) => {
    return (reviewsByResource[resourceId] ?? []).length;
  }, [reviewsByResource]);

  /* All user-submitted reviews across all resources (flat list, newest first) */
  const getAllUserReviews = useCallback(() => {
    return Object.entries(reviewsByResource).flatMap(([resourceId, reviews]) =>
      reviews.map(r => ({ ...r, resourceId: Number(resourceId) }))
    ).sort((a, b) => b.id - a.id);
  }, [reviewsByResource]);

  /* Delete a single review (admin moderation) */
  const deleteReview = useCallback((resourceId, reviewId) => {
    setReviewsByResource(prev => {
      const existing = prev[resourceId] ?? [];
      const updated = { ...prev, [resourceId]: existing.filter(r => r.id !== reviewId) };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /* Global stats for admin dashboard */
  const globalStats = useMemo(() => {
    const allUserReviews = Object.values(reviewsByResource).flat();
    const totalUserReviews = allUserReviews.length;
    const avgRating = totalUserReviews > 0
      ? (allUserReviews.reduce((s, r) => s + r.rating, 0) / totalUserReviews).toFixed(1)
      : null; // null means "no user reviews yet"
    return { totalUserReviews, avgRating };
  }, [reviewsByResource]);

  return (
    <RatingsContext.Provider value={{
      addReview,
      getReviews,
      getAvgRating,
      getUserReviewCount,
      getAllUserReviews,
      deleteReview,
      globalStats,
    }}>
      {children}
    </RatingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRatings() {
  const ctx = useContext(RatingsContext);
  if (!ctx) throw new Error('useRatings must be inside RatingsProvider');
  return ctx;
}
