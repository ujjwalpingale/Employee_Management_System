import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { username, password });
        const token = res.data.access_token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth(token, payload.role);
        navigate('/');
      } else {
        await api.post('/auth/register', { username, email, password, role: 'admin' });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '400px', maxWidth: '90%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {error && <div style={{ color: error.includes('successful') ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input className="glass-input" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required minLength={3}/>
          {!isLogin && (
            <input className="glass-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
          )}
          <input className="glass-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}/>
          
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} type="submit">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary-color)', cursor: 'pointer' }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}
