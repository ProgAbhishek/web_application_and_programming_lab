import { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CardModal({ card, projectId, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: card.title,
    description: card.description || '',
    priority: card.priority,
    due_date: card.due_date || '',
  });

  const save = async () => {
    try {
      const { data } = await api.patch(
        `projects/${projectId}/columns/${card.column}/cards/${card.id}/`,
        form
      );
      toast.success('Card updated!');
      onUpdate(data);
    } catch {
      toast.error('Update failed.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '480px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Edit Card</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <label style={lbl}>Title</label>
        <input style={inp} value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <label style={lbl}>Description</label>
        <textarea style={{ ...inp, height: '80px', resize: 'vertical' }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <label style={lbl}>Priority</label>
        <select style={inp} value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label style={lbl}>Due Date</label>
        <input style={inp} type="date" value={form.due_date}
          onChange={e => setForm({ ...form, due_date: e.target.value })} />

        <button onClick={save}
          style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

const lbl = { display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '13px', marginTop: '12px' };
const inp = { display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };