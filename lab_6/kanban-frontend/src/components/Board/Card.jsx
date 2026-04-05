import { Draggable } from '@hello-pangea/dnd';

const priorityColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function Card({ card, index, onClick }) {
  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(card)}
          style={{
            background: snapshot.isDragging ? '#eef2ff' : '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '8px',
            cursor: 'pointer',
            boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            ...provided.draggableProps.style,
          }}
        >
          <p style={{ margin: '0 0 6px', fontWeight: 500, fontSize: '14px' }}>{card.title}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              background: priorityColors[card.priority],
              color: '#fff', fontSize: '11px',
              padding: '2px 8px', borderRadius: '10px'
            }}>
              {card.priority}
            </span>
            {card.due_date && (
              <span style={{ fontSize: '11px', color: '#888' }}>📅 {card.due_date}</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}