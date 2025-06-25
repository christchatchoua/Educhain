import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUpUser, loginUser } from '../services/authService';
import styles from './AuthPage.module.css';

const roles = [
  { value: 'issuer', label: 'Issuer' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'verifier', label: 'Verifier' },
];

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    institutionName: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.intendedRole) {
      setForm((prev) => ({ ...prev, role: location.state.intendedRole }));
      setMode('signup');
    }
    if (location.state && location.state.error) {
      setMessage({ type: 'error', text: location.state.error });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return 'A valid email is required.';
    }
    if (!form.password || form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (mode === 'signup') {
      if (!form.fullName) return 'Full Name is required.';
      if (!form.role) return 'Role is required.';
      if (form.role === 'issuer' && !form.institutionName) {
        return 'Institution Name is required for Issuers.';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const error = validate();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    setLoading(true);
    if (mode === 'signup') {
      const { error: signUpError, user } = await signUpUser({
        email: form.email,
        password: form.password,
        role: form.role,
        fullName: form.fullName,
        institutionName: form.role === 'issuer' ? form.institutionName : null,
      });
      if (signUpError) {
        setMessage({ type: 'error', text: signUpError.message });
      } else {
        setMessage({ type: 'success', text: 'Sign up successful! Please log in.' });
        setMode('login');
        setForm({ fullName: '', email: '', password: '', role: '', institutionName: '' });
      }
    } else {
      const { error: loginError, user, role } = await loginUser({
        email: form.email,
        password: form.password,
      });
      if (loginError) {
        setMessage({ type: 'error', text: loginError.message });
      } else {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => {
          if (role === 'issuer') navigate('/issuer');
          else if (role === 'wallet') navigate('/wallet');
          else if (role === 'verifier') navigate('/verifier');
          else navigate('/');
        }, 1000);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setMessage({ type: '', text: '' });
    setForm({ fullName: '', email: '', password: '', role: '', institutionName: '' });
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {mode === 'signup' && (
          <>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>
            {form.role === 'issuer' && (
              <label>
                Institution Name
                <input
                  type="text"
                  name="institutionName"
                  value={form.institutionName}
                  onChange={handleChange}
                  required={form.role === 'issuer'}
                />
              </label>
            )}
          </>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </label>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner}></span> : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        <div className={styles.toggleLink}>
          {mode === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button type="button" onClick={toggleMode} className={styles.linkBtn}>Sign Up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button type="button" onClick={toggleMode} className={styles.linkBtn}>Login</button>
            </>
          )}
        </div>
        {message.text && (
          <div className={message.type === 'error' ? styles.errorMsg : styles.successMsg}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
} 