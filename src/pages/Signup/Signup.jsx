import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/brand/BrandLogo';
import '../Login/Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  // Determine which fields to highlight in red
  const pwError = error && /password/i.test(error);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <BrandLogo size="lg" />
        </div>
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__sub">Join ReadSpace — it&apos;s free forever</p>

        {error && (
          <div className="auth-error" role="alert" aria-live="assertive">
            <span className="auth-error__icon" aria-hidden="true">⚠</span>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" className="form-input" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`form-input${pwError ? ' form-input--error' : ''}`}
              placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} required
              aria-invalid={pwError || undefined}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm" name="confirm" type="password"
              className={`form-input${pwError ? ' form-input--error' : ''}`}
              placeholder="Repeat password"
              value={form.confirm} onChange={handleChange} required
              aria-invalid={pwError || undefined}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
