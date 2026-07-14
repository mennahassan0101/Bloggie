import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const emailFromLink = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [done, setDone] = useState(false);

  function fieldError(name) {
    return fieldErrors[name]?.[0];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    if (!token) {
      setFormError('This reset link is missing its token. Please request a new one.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirm,
      });
      setDone(true);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else {
        setFormError(err.response?.data?.message || 'Unable to reset password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Set a new password</h2>
        <div className="sub">Choose a new password for your account.</div>

        {formError && <div className="banner-error">{formError}</div>}

        {done ? (
          <div className="field">
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
              Password reset successfully. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <form className="auth-pane" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="rp-email">Email</label>
              <input
                id="rp-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldError('email') && <div className="error-text">{fieldError('email')}</div>}
            </div>
            <div className="field">
              <label htmlFor="rp-pass">New password</label>
              <input
                id="rp-pass"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {fieldError('password') && (
                <div className="error-text">{fieldError('password')}</div>
              )}
            </div>
            <div className="field">
              <label htmlFor="rp-pass-confirm">Confirm new password</label>
              <input
                id="rp-pass-confirm"
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Resetting…' : 'Reset password'}
            </button>
            <div className="auth-foot">
              <Link to="/auth" className="btn-text">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}