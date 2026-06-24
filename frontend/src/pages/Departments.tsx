import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store';
import { Trash2 } from 'lucide-react';

export default function Departments() {
  const [deps, setDeps] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const role = useAuthStore(s => s.role);

  const fetchDeps = async () => {
    try {
      const res = await api.get('/departments/');
      setDeps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDeps(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/departments/', { name, description: desc });
      setName(''); setDesc('');
      fetchDeps();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error creating department");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDeps();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error deleting department");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Departments</h1>
      </div>

        <form onSubmit={handleCreate} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input className="glass-input" style={{ marginBottom: 0 }} placeholder="Department Name" value={name} onChange={e => setName(e.target.value)} required minLength={2}/>
          </div>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <input className="glass-input" style={{ marginBottom: 0 }} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit">Create</button>
        </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {deps.map(d => (
          <div key={d.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between">
              <h3>{d.name}</h3>
                <button className="btn-danger" onClick={() => handleDelete(d.id)}><Trash2 size={16}/></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{d.description || 'No description'}</p>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'gray' }}>ID: {d.id}</div>
          </div>
        ))}
        {deps.length === 0 && <p>No departments found.</p>}
      </div>
    </div>
  );
}
