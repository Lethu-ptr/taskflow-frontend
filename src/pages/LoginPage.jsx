// ============================================================
//  TaskFlow – LoginPage.jsx   ( route: /login )
//  Handles both Login and Register in one form.
//  Matches TaskFlow dark productivity theme.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

// ── Validation ────────────────────────────────────────────────
function validate(form, isRegister) {
  const errors = {};

  if (isRegister && !form.name.trim())
    errors.name = 'Name is required.';

  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'A valid email address is required.';

  if (form.password.length < 6)
    errors.password = 'Password must be at least 6 characters.';

  if (isRegister && form.password !== form.confirm)
    errors.confirm = 'Passwords do not match.';

  return errors;
}

const EMPTY = { name: '', email: '', password: '', confirm: '' };

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  // Update field + re-validate if already touched
  function handleChange(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const e = validate(updated, isRegister);
      setErrors(prev => ({ ...prev, [field]: e[field] }));
    }
  }

  // Mark touched on blur and run validation
  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(form, isRegister));
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();
    // Touch all fields to show any remaining errors
    setTouched({ name: true, email: true, password: true, confirm: true });
    const errs = validate(form, isRegister);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setApiError('');

    try {
      if (isRegister) {
        await register(form.name.trim(), form.email.trim(), form.password);
      } else {
        await login(form.email.trim(), form.password);
      }
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Switch between login / register modes
  function switchMode() {
    setIsRegister(prev => !prev);
    setForm(EMPTY);
    setErrors({});
    setTouched({});
    setApiError('');
  }

  return (
    <div className="login-page">

      {/* Background glow orbs */}
      <div className="login-page__orb login-page__orb--1" aria-hidden="true" />
      <div className="login-page__orb login-page__orb--2" aria-hidden="true" />

      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <span className="login-brand__mark">✦</span>
          <span className="login-brand__name">
            Task<em>Flow</em>
          </span>
        </div>

        {/* Heading */}
        <h1 className="login-title">
          {isRegister ? 'Create Account' : 'Welcome back'}
        </h1>
        <p className="login-sub">
          {isRegister
            ? 'Sign up to start tracking your tasks.'
            : 'Sign in to continue to your dashboard.'}
        </p>

        {/* API / server error banner */}
        {apiError && (
          <div className="login-api-error" role="alert">
            <span>⚠</span> {apiError}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {/* Name — register only */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="tf-name" className="form-label">Full Name *</label>
              <input
                id="tf-name"
                type="text"
                className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Your full name"
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors.name ? 'name-err' : undefined}
              />
              {touched.name && errors.name && (
                <span id="name-err" className="field-error" role="alert">
                  ⚠ {errors.name}
                </span>
              )}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="tf-email" className="form-label">Email Address *</label>
            <input
              id="tf-email"
              type="email"
              className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              autoComplete="email"
              aria-required="true"
              aria-describedby={errors.email ? 'email-err' : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-err" className="field-error" role="alert">
                ⚠ {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="tf-password" className="form-label">Password *</label>
            <input
              id="tf-password"
              type="password"
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Min. 6 characters"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              aria-required="true"
              aria-describedby={errors.password ? 'pw-err' : undefined}
            />
            {touched.password && errors.password && (
              <span id="pw-err" className="field-error" role="alert">
                ⚠ {errors.password}
              </span>
            )}
          </div>

          {/* Confirm password — register only */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="tf-confirm" className="form-label">
                Confirm Password *
              </label>
              <input
                id="tf-confirm"
                type="password"
                className={`form-input ${touched.confirm && errors.confirm ? 'error' : ''}`}
                value={form.confirm}
                onChange={e => handleChange('confirm', e.target.value)}
                onBlur={() => handleBlur('confirm')}
                placeholder="Repeat your password"
                autoComplete="new-password"
                aria-required="true"
                aria-describedby={errors.confirm ? 'confirm-err' : undefined}
              />
              {touched.confirm && errors.confirm && (
                <span id="confirm-err" className="field-error" role="alert">
                  ⚠ {errors.confirm}
                </span>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : isRegister
                ? '✦ Create Account'
                : '→ Sign In'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="login-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="login-switch__btn" onClick={switchMode}>
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>

      </div>
    </div>
  );
}
