import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      try {
        await onUpdate(todo._id, editTitle.trim());
      } catch (error) {
        console.error('Failed to update todo:', error);
        setEditTitle(todo.title); // Reset on error
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div style={styles.todoItem}>
      <div style={styles.todoContent}>
        <button
          onClick={() => onToggle(todo._id, todo.done)}
          style={{
            ...styles.checkbox,
            ...(todo.done ? styles.checkboxChecked : {})
          }}
          title={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.done && <span style={styles.checkmark}>✓</span>}
        </button>
        
        {isEditing ? (
          <div style={styles.editContainer}>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              style={styles.editInput}
              autoFocus
            />
            <div style={styles.editActions}>
              <button onClick={handleSave} style={styles.saveButton} title="Save">
                ✓
              </button>
              <button onClick={handleCancel} style={styles.cancelButton} title="Cancel">
                ✕
              </button>
            </div>
          </div>
        ) : (
          <span
            style={{
              ...styles.todoTitle,
              ...(todo.done ? styles.todoTitleCompleted : {})
            }}
            onDoubleClick={handleEdit}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
        
        {todo.timeAgo && (
          <span style={styles.timeAgo}>{todo.timeAgo}</span>
        )}
      </div>
      
      <div style={styles.actions}>
        {!isEditing && (
          <button
            onClick={handleEdit}
            style={styles.editButton}
            title="Edit todo"
          >
            ✏️
          </button>
        )}
        <button
          onClick={() => onDelete(todo._id)}
          style={styles.deleteButton}
          title="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

const styles = {
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    gap: '15px',
    position: 'relative'
  },
  todoContent: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    minWidth: 0
  },
  checkbox: {
    width: '24px',
    height: '24px',
    border: '2px solid #ddd',
    borderRadius: '50%',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: '0'
  },
  checkboxChecked: {
    background: '#667eea',
    borderColor: '#667eea'
  },
  checkmark: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  todoTitle: {
    fontSize: '1.1rem',
    color: '#333',
    transition: 'all 0.3s ease',
    lineHeight: '1.4',
    flex: '1',
    cursor: 'pointer'
  },
  todoTitleCompleted: {
    textDecoration: 'line-through',
    color: '#888',
    opacity: '0.7'
  },
  timeAgo: {
    fontSize: '0.8rem',
    color: '#999',
    fontStyle: 'italic',
    flexShrink: '0'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  editButton: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    opacity: '0.6'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    opacity: '0.6'
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1'
  },
  editInput: {
    flex: '1',
    border: '2px solid #667eea',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '1rem',
    outline: 'none',
    background: 'white'
  },
  editActions: {
    display: 'flex',
    gap: '5px'
  },
  saveButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  cancelButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};
