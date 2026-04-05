import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Column({ column, projectId, onCardAdded, onCardClick }) {
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const addCard = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        `projects/${projectId}/columns/${column.id}/cards/`,
        { title: newTitle, priority: 'medium', order: column.cards.length }
      );
      onCardAdded(column.id, data);
      setNewTitle('');
      setAdding(false);
      toast.success('Card added!');
    } catch {
      toast.error('Failed to add card.');
    }
  };

  return (
    <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '12px', width: '272px', flexShrink: 0 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600 }}>
        {column.title}
        <span style={{ float: 'right', color: '#94a3b8', fontWeight: 400 }}>{column.cards.length}</span>
      </h3>

      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '40px' }}>
            {column.cards.map((card, i) => (
              <Card key={card.id} card={card} index={i} onClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {adding ? (
        <form onSubmit={addCard} style={{ marginTop: '8px' }}>
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Card title..."
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', marginBottom: '6px' }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="submit" style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', padding: '7px', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
            <button type="button" onClick={() => setAdding(false)} style={{ flex: 1, background: '#e5e7eb', border: 'none', padding: '7px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)}
          style={{ width: '100%', marginTop: '8px', background: 'transparent', border: '1px dashed #cbd5e1', padding: '7px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}>
          + Add card
        </button>
      )}
    </div>
  );
}