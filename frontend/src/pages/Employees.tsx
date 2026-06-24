import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store';
import { Trash2 } from 'lucide-react';

export default function Employees() {
  const [data, setData] = useState<any>({ items: [], total_pages: 1, page: 1, total_records: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const role = useAuthStore(s => s.role);

  // Filters
  const [depFilter, setDepFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [desig, setDesig] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [depId, setDepId] = useState('');

  const fetchEmps = async () => {
    try {
      let query = `/employees/?page=${page}&size=10`;
      if (search) query += `&search=${search}`;
      if (depFilter) query += `&department_id=${depFilter}`;
      if (desigFilter) query += `&designation=${desigFilter}`;
      const res = await api.get(query);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEmps(); }, [page, search, depFilter, desigFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/employees/', {
        name, email, salary: parseFloat(salary), designation: desig, joining_date: joinDate, department_id: parseInt(depId)
      });
      fetchEmps();
      setName(''); setEmail(''); setSalary(''); setDesig(''); setJoinDate(''); setDepId('');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error creating employee");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmps();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error deleting employee");
    }
  };

  return (
    <div>
      <h1>Employees</h1>

      <div className="flex gap-4 mt-4 mb-4">
        <input className="glass-input" style={{ marginBottom: 0 }} placeholder="Search name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <input className="glass-input" style={{ marginBottom: 0 }} placeholder="Filter by Dept ID..." value={depFilter} onChange={e => { setDepFilter(e.target.value); setPage(1); }} type="number" />
        <input className="glass-input" style={{ marginBottom: 0 }} placeholder="Filter by Designation..." value={desigFilter} onChange={e => { setDesigFilter(e.target.value); setPage(1); }} />
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Designation</th>
              <th style={{ padding: '1rem' }}>Salary</th>
              <th style={{ padding: '1rem' }}>Dept ID</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>No employees found.</td></tr>
            )}
            {data.items.map((e: any) => (
              <tr key={e.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{e.id}</td>
                <td style={{ padding: '1rem' }}>{e.name}</td>
                <td style={{ padding: '1rem' }}>{e.email}</td>
                <td style={{ padding: '1rem' }}>{e.designation}</td>
                <td style={{ padding: '1rem' }}>${e.salary.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>{e.department_id}</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn-danger" onClick={() => handleDelete(e.id)}><Trash2 size={16}/></button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button className="btn-primary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {data.page} of {Math.max(1, data.total_pages)} (Total: {data.total_records})</span>
        <button className="btn-primary" disabled={page >= data.total_pages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

        <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem' }}>
          <h3>Add New Employee</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input className="glass-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required minLength={2}/>
            <input className="glass-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <input className="glass-input" type="number" placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} required min={1}/>
            <input className="glass-input" placeholder="Designation" value={desig} onChange={e => setDesig(e.target.value)} required minLength={2}/>
            <input className="glass-input" type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} required/>
            <input className="glass-input" type="number" placeholder="Department ID" value={depId} onChange={e => setDepId(e.target.value)} required/>
            <button className="btn-primary" type="submit" style={{ gridColumn: 'span 2' }}>Create Employee</button>
          </form>
        </div>
    </div>
  );
}
