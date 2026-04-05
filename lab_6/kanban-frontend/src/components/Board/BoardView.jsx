import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useParams, useNavigate } from 'react-router-dom';
import Column from './Column';
import CardModal from '../Modals/CardModal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function BoardView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newColTitle, setNewColTitle] = useState('');

  useEffect(() => {
    api.get(`projects/${projectId}/`).then(r => {
      setProject(r.data);
      setColumns(r.data.columns);
    });
  }, [projectId]);

  const onDragEnd = async ({ draggableId, source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcColId = parseInt(source.droppableId);
    const dstColId = parseInt(destination.droppableId);
    const cardId   = parseInt(draggableId);

    // Optimistic update
    setColumns(prev => {
      const next = prev.map(c => ({ ...c, cards: [...c.cards] }));
      const srcCol = next.find(c => c.id === srcColId);
      const dstCol = next.find(c => c.id === dstColId);
      const [card] = srcCol.cards.splice(source.index, 1);
      dstCol.cards.splice(destination.index, 0, card);
      return next;
    });

    try {
      await api.patch(
        `projects/${projectId}/columns/${srcColId}/cards/${cardId}/move/`,
        { column_id: dstColId, order: destination.index }
      );
    } catch {
      toast.error('Move failed, refreshing...');
      api.get(`projects/${projectId}/`).then(r => setColumns(r.data.columns));
    }
  };

  const addColumn = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`projects/${projectId}/columns/`, {
      title: newColTitle, order: columns.length
    });
    setColumns([...columns, { ...data, cards: [] }]);
    setNewColTitle('');
    toast.success('Column added!');
  };

  const onCardAdded = (colId, card) => {
    setColumns(prev => prev.map(c =>
      c.id === colId ? { ...c, cards: [...c.cards, card] } : c
    ));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ background: '#4f46e5', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#c7d2fe', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h2 style={{ color: '#fff', margin: 0 }}>{project?.name}</h2>
      </div>

      {/* Board */}
      <div style={{ padding: '1.5rem', display: 'flex', gap: '16px', overflowX: 'auto', alignItems: 'flex-start' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map(col => (
            <Column
              key={col.id}
              column={col}
              projectId={projectId}
              onCardAdded={onCardAdded}
              onCardClick={setSelectedCard}
            />
          ))}
        </DragDropContext>

        {/* Add Column */}
        <form onSubmit={addColumn} style={{ background: '#f1f5f9', borderRadius: '12px', padding: '12px', width: '272px', flexShrink: 0 }}>
          <input
            value={newColTitle}
            onChange={e => setNewColTitle(e.target.value)}
            placeholder="New column name..."
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', marginBottom: '6px' }}
          />
          <button type="submit" style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
            + Add Column
          </button>
        </form>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          projectId={projectId}
          onClose={() => setSelectedCard(null)}
          onUpdate={(updated) => {
            setColumns(prev => prev.map(c => ({
              ...c,
              cards: c.cards.map(card => card.id === updated.id ? updated : card)
            })));
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}