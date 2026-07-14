import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFieldError('');
    setSubmitting(true);
    try {
      await api.post('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldError(err.response.data.errors?.email?.[0] || 'Invalid email.');
      } else {
        setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset your password</h2>
        <div className="sub">
          Enter the email on your account and we'll send you a link to reset it.
        </div>

        {formError && <div className="banner-error">{formError}</div>}

        {sent ? (
          <>
            <div className="field">
              <p style={{ fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
                If an account exists for <b>{email}</b>, a reset link is on its way. Check your
                inbox (and spam folder).
              </p>
            </div>
            <div className="auth-foot">
              <Link to="/auth" className="btn-text">
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <form className="auth-pane" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldError && <div className="error-text">{fieldError}</div>}
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset link'}
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