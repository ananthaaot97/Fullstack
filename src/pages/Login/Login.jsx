import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/brand/BrandLogo';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(form.email.includes('admin') ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  // Demo shortcut
  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@libraryfreedom.edu', password: 'admin123' });
    else setForm({ email: 'student@libraryfreedom.edu', password: 'student123' });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <BrandLogo size="lg" />
        </div>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__sub">Sign in to your ReadSpace account</p>

        <div className="auth-demo-btns">
          <button className="btn btn--secondary btn--sm" onClick={() => fillDemo('student')}>
            Demo Student
          </button>
          <button className="btn btn--secondary btn--sm" onClick={() => fillDemo('admin')}>
            Demo Admin
          </button>
        </div>

        {error && (
          <div className="auth-error" role="alert" aria-live="assertive">
            <span className="auth-error__icon" aria-hidden="true">⚠</span>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input${error ? ' form-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input${error ? ' form-input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </main>
  );
}
