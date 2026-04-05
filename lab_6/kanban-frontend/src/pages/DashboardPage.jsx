import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('projects/').then(r => setProjects(r.data));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('projects/', { name: newName });
      setProjects([...projects, data]);
      setNewName('');
      setShowForm(false);
      toast.success('Project created!');
    } catch {
      toast.error('Failed to create project.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <nav style={{ background: '#4f46e5', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>🗂️ KanbanApp</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#c7d2fe' }}>Hello, {user?.username}</span>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid #c7d2fe', color: '#c7d2fe', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>My Projects</h2>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer' }}>
            + New Project
          </button>
        </div>

        {showForm && (
          <form onSubmit={createProject} style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Project name..."
              required
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
            />
            <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              Create
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{p.name}</h3>
              <p style={{ color: '#888', fontSize: '13px', margin: '0 0 1rem' }}>
                {p.members.length + 1} member(s) · {p.columns.length} columns
              </p>
              <button onClick={() => navigate(`/board/${p.id}`)}
                style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                Open Board →
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <p style={{ color: '#888' }}>No projects yet. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
}