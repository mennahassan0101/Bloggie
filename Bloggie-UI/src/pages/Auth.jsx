import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Auth() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // shared submit/error state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // sign-in fields
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // sign-up fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suPasswordConfirm, setSuPasswordConfirm] = useState('');
  const [suImage, setSuImage] = useState(null);
  const [suImagePreview, setSuImagePreview] = useState(null);

  function resetErrors() {
    setFormError('');
    setFieldErrors({});
  }

  function switchTab(name) {
    resetErrors();
    setTab(name);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSuImage(file);
    setSuImagePreview(URL.createObjectURL(file));
  }

  async function handleSignIn(e) {
    e.preventDefault();
    resetErrors();
    setSubmitting(true);
    try {
      await login(siEmail, siPassword);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setFormError(err.response.data.message || 'Incorrect email or password.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    resetErrors();

    if (suPassword !== suPasswordConfirm) {
      setFieldErrors({ password: ['Passwords do not match.'] });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', suName);
      formData.append('email', suEmail);
      formData.append('password', suPassword);
      formData.append('password_confirmation', suPasswordConfirm);
      if (suImage) formData.append('image', suImage);

      await register(formData);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name) {
    return fieldErrors[name]?.[0];
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{tab === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
        <div className="sub">
          {tab === 'signin'
            ? 'Sign in to read and write posts.'
            : 'Join to start posting and commenting.'}
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'signin' ? 'is-active' : ''}`}
            onClick={() => switchTab('signin')}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'is-active' : ''}`}
            onClick={() => switchTab('signup')}
            type="button"
          >
            Create account
          </button>
        </div>

        {formError && <div className="banner-error">{formError}</div>}

        {tab === 'signin' ? (
          <form className="auth-pane" onSubmit={handleSignIn}>
            <div className="field">
              <label htmlFor="si-email">Email</label>
              <input
                id="si-email"
                type="email"
                placeholder="you@example.com"
                value={siEmail}
                onChange={(e) => setSiEmail(e.target.value)}
                required
              />
              {fieldError('email') && <div className="error-text">{fieldError('email')}</div>}
            </div>
            <div className="field">
              <label htmlFor="si-pass">Password</label>
              <input
                id="si-pass"
                type="password"
                placeholder="••••••••"
                value={siPassword}
                onChange={(e) => setSiPassword(e.target.value)}
                required
              />
              {fieldError('password') && (
                <div className="error-text">{fieldError('password')}</div>
              )}
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Link to="/forgot-password" className="btn-text" style={{ fontSize: 12 }}>
                  Forgot password?
                </Link>
              </div>
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="auth-foot">
              No account yet?{' '}
              <button type="button" className="btn-text" onClick={() => switchTab('signup')}>
                Create one
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-pane" onSubmit={handleSignUp}>
            <div className="field">
              <label htmlFor="su-name">Name</label>
              <input
                id="su-name"
                type="text"
                placeholder="Jordan Ellery"
                value={suName}
                onChange={(e) => setSuName(e.target.value)}
                required
              />
              {fieldError('name') && <div className="error-text">{fieldError('name')}</div>}
            </div>
            <div className="field">
              <label htmlFor="su-email">Email</label>
              <input
                id="su-email"
                type="email"
                placeholder="you@example.com"
                value={suEmail}
                onChange={(e) => setSuEmail(e.target.value)}
                required
              />
              {fieldError('email') && <div className="error-text">{fieldError('email')}</div>}
            </div>
            <div className="field">
              <label htmlFor="su-pass">Password</label>
              <input
                id="su-pass"
                type="password"
                placeholder="At least 8 characters"
                value={suPassword}
                onChange={(e) => setSuPassword(e.target.value)}
                required
              />
              {fieldError('password') && (
                <div className="error-text">{fieldError('password')}</div>
              )}
            </div>
            <div className="field">
              <label htmlFor="su-pass-confirm">Confirm password</label>
              <input
                id="su-pass-confirm"
                type="password"
                placeholder="••••••••"
                value={suPasswordConfirm}
                onChange={(e) => setSuPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Profile image</label>
              <label className="file-drop" htmlFor="su-image">
                <div className="avatar" style={{ background: 'var(--mustard)' }}>
                  {suImagePreview ? (
                    <img src={suImagePreview} alt="Preview" />
                  ) : (
                    initials(suName) || 'JE'
                  )}
                </div>
                <span>
                  Drop an image, or <b style={{ color: 'var(--accent-2)' }}>browse files</b>
                </span>
                <input
                  id="su-image"
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={handleImageChange}
                />
              </label>
              {fieldError('image') && <div className="error-text">{fieldError('image')}</div>}
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
            <div className="auth-foot">
              Already have one?{' '}
              <button type="button" className="btn-text" onClick={() => switchTab('signin')}>
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}