import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/brand/BrandLogo';
import Captcha, { useCaptcha } from '../../components/Captcha/Captcha';
import { Zap, GraduationCap, ShieldCheck } from 'lucide-react';
import './Auth.css';

/* Stagger container — children animate in sequence */
const cardVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/* Each staggered child */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

/* Reduced-motion overrides */
const cardVariantsReduced = {};
const itemVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const prefersReduced = useReducedMotion();
  const { code: captchaCode, refresh: refreshCaptcha, verify: verifyCaptcha } = useCaptcha();
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const cv = prefersReduced ? cardVariantsReduced : cardVariants;
  const iv = prefersReduced ? itemVariantsReduced : itemVariants;

  const handleChange = e => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCaptchaError('');

    // Validate CAPTCHA first
    if (!verifyCaptcha(captchaInput)) {
      setCaptchaError('Incorrect code — please try again.');
      setCaptchaInput('');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(form.email.includes('admin') ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
      // Refresh CAPTCHA on any failed attempt
      setCaptchaInput('');
      refreshCaptcha();
    }
  };

  // 1-click demo login — bypasses form & CAPTCHA
  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    const email = role === 'admin' ? 'admin@readspace.edu' : 'student@readspace.edu';
    const password = role === 'admin' ? 'admin123' : 'student123';
    await new Promise(r => setTimeout(r, 420));
    const result = login(email, password);
    setLoading(false);
    if (result.success) navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <main className="auth-page">
      <Motion.div
        className="auth-card"
        variants={cv}
        initial="hidden"
        animate="visible"
      >
        <Motion.div className="auth-card__logo" variants={iv}>
          <BrandLogo size="lg" />
        </Motion.div>
        <Motion.h1 className="auth-card__title" variants={iv}>Welcome back</Motion.h1>
        <Motion.p className="auth-card__sub" variants={iv}>Sign in to your ReadSpace account</Motion.p>

        {/* ── 1-Click Demo Section ── */}
        <Motion.div className="auth-demo-section" variants={iv}>
          <div className="auth-demo-label">
            <Zap size={12} aria-hidden="true" />
            Quick Demo Access — no form required
          </div>
          <div className="auth-demo-cards">
            <button
              type="button"
              className="auth-demo-card"
              onClick={() => handleDemoLogin('student')}
              disabled={loading}
              aria-label="Sign in instantly as Demo Student"
            >
              <span className="auth-demo-card__icon auth-demo-card__icon--student">
                <GraduationCap size={20} aria-hidden="true" />
              </span>
              <span className="auth-demo-card__body">
                <strong>Student</strong>
                <span>Browse &amp; download resources</span>
              </span>
            </button>

            <button
              type="button"
              className="auth-demo-card"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              aria-label="Sign in instantly as Demo Admin"
            >
              <span className="auth-demo-card__icon auth-demo-card__icon--admin">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <span className="auth-demo-card__body">
                <strong>Admin</strong>
                <span>Manage resources &amp; users</span>
              </span>
            </button>
          </div>
        </Motion.div>

        <Motion.div className="auth-divider" variants={iv}>
          <span>or sign in with credentials</span>
        </Motion.div>

        {error && (
          <Motion.div
            className="auth-error"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <span className="auth-error__icon" aria-hidden="true">⚠</span>
            {error}
          </Motion.div>
        )}

        <Motion.form className="auth-form" onSubmit={handleSubmit} noValidate variants={iv}>
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
          <Captcha
            code={captchaCode}
            onRefresh={() => { refreshCaptcha(); setCaptchaInput(''); setCaptchaError(''); }}
            value={captchaInput}
            onChange={v => { setCaptchaInput(v); setCaptchaError(''); }}
            error={captchaError}
          />

          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </Motion.form>

        <Motion.p className="auth-card__footer" variants={iv}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </Motion.p>
      </Motion.div>
    </main>
  );
}
