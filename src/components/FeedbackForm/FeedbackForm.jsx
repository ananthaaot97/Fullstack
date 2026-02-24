import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, MessageSquare } from 'lucide-react';
import './FeedbackForm.css';

function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function FeedbackForm({ resource, onClose }) {
  const [form, setForm] = useState({ rating: 5, type: 'review', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = getFocusable(modalRef.current);
        if (!focusable.length) { e.preventDefault(); return; }
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitted(true);
  };

  if (!resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div
        className="modal feedback-modal"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close"><X size={18} strokeWidth={2} aria-hidden="true" /></button>

        {submitted ? (
          <div className="feedback-modal__success">
            <div className="feedback-modal__success-icon"><CheckCircle size={44} strokeWidth={1.5} aria-hidden="true" /></div>
            <h2>Thank you for your feedback!</h2>
            <p>Your review for <strong>"{resource.title}"</strong> has been submitted.</p>
            <button className="btn btn--primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="feedback-modal__header">
              <h2 id="feedback-title"><MessageSquare size={18} aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Leave Feedback</h2>
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
