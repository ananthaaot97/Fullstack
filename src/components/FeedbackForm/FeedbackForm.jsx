import { useState, useEffect } from 'react';
import './FeedbackForm.css';

export default function FeedbackForm({ resource, onClose }) {
  const [form, setForm] = useState({ rating: 5, type: 'review', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitted(true);
  };

  if (!resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Feedback form">
      <div className="modal feedback-modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div className="feedback-modal__success">
            <div className="feedback-modal__success-icon">✅</div>
            <h2>Thank you for your feedback!</h2>
            <p>Your review for <strong>"{resource.title}"</strong> has been submitted.</p>
            <button className="btn btn--primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="feedback-modal__header">
              <h2>💬 Leave Feedback</h2>
              <p>Reviewing: <strong>{resource.title}</strong></p>
            </div>

            <form className="feedback-modal__form" onSubmit={handleSubmit}>
              {/* Star rating */}
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div className="star-rating">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn${n <= form.rating ? ' filled' : ''}`}
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      aria-label={`Rate ${n} stars`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-label">{form.rating} / 5</span>
                </div>
              </div>

              {/* Feedback type */}
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-input form-select"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="review">General Review</option>
                  <option value="error">Report Error / Typo</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="quality">Quality Concern</option>
                </select>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label">Your Comments <span className="required">*</span></label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Share your thoughts about this resource…"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="feedback-modal__footer">
                <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn--primary">Submit Feedback</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
