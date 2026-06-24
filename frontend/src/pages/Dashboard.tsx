import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ deps: 0, emps: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dRes = await api.get('/departments/');
        const eRes = await api.get('/employees/');
        setStats({ deps: dRes.data.length, emps: eRes.data.total_records || 0 });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Total Departments</h3>
          <p style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.deps}</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Total Employees</h3>
          <p style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.emps}</p>
        </div>
      </div>
    </div>
  );
}
