import { useEffect, useState } from 'react';
import { useTodos } from './hooks/useTodos.js';
import TodoItem from './components/TodoItem.jsx';

export default function App() {
  const [title, setTitle] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    todos,
    loading,
    error,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoTitle
  } = useTodos();

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Show notification for 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    
    setSubmitting(true);
    try {
      await addTodo(title.trim());
      setTitle('');
      setNotification({ type: 'success', message: 'Todo added successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTodo = async (id, done) => {
    try {
      await toggleTodo(id, done);
      setNotification({
        type: 'success',
        message: done ? 'Todo completed!' : 'Todo marked as incomplete!'
      });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setNotification({ type: 'success', message: 'Todo deleted!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleUpdateTodo = async (id, title) => {
    try {
      await updateTodoTitle(id, title);
      setNotification({ type: 'success', message: 'Todo updated!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const completedTodos = todos.filter(t => t.done).length;
  const totalTodos = todos.length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div style={styles.container}>
      <div style={styles.app}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📝</span>
            Todo App
          </h1>
          <p style={styles.subtitle}>Stay organized, stay productive</p>
        </header>

        {/* Notification */}
        {notification && (
          <div style={{
            ...styles.notification,
            ...(notification.type === 'error' ? styles.notificationError : styles.notificationSuccess)
          }}>
            {notification.message}
          </div>
        )}

        {/* Error Display */}
        {error && !notification && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>Error: {error}</span>
            <button onClick={loadTodos} style={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{totalTodos}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{completedTodos}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{pendingTodos}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} style={styles.form}>
          <div style={{
            ...styles.inputContainer,
            ...(inputFocused ? styles.inputFocused : {})
          }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="What needs to be done?"
              style={styles.input}
              disabled={submitting}
              maxLength={500}
            />
            <button 
              type="submit" 
              style={styles.addButton}
              disabled={submitting || !title.trim()}
            >
              <span style={styles.addIcon}>
                {submitting ? '⏳' : '+'}
              </span>
            </button>
          </div>
          {title.length > 400 && (
            <div style={styles.charCount}>
              {title.length}/500 characters
            </div>
          )}
        </form>

        {/* Todos List */}
        <div style={styles.todosContainer}>
          {loading ? (
            <div style={styles.loading}>
              <span style={styles.loadingSpinner}>⏳</span>
              Loading todos...
            </div>
          ) : todos.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>✨</span>
              <p style={styles.emptyText}>No todos yet! Add one above to get started.</p>
            </div>
          ) : (
            <div style={styles.todosList}>
              {todos.map(todo => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  app: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center',
    padding: '40px 30px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  titleIcon: {
    fontSize: '2rem'
  },
  subtitle: {
    margin: '0',
    fontSize: '1.1rem',
    opacity: '0.9',
    fontWeight: '300'
  },
  notification: {
    padding: '12px 20px',
    margin: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500',
    animation: 'slideDown 0.3s ease-out'
  },
  notificationSuccess: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  notificationError: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    margin: '20px',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    border: '1px solid #f5c6cb'
  },
  errorIcon: {
    fontSize: '1.2rem'
  },
  errorText: {
    flex: '1',
    fontSize: '0.9rem'
  },
  retryButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '25px 30px',
    background: 'white',
    borderBottom: '1px solid #f0f0f0'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#667eea'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  form: {
    padding: '30px'
  },
  inputContainer: {
    display: 'flex',
    border: '2px solid #e1e5e9',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    background: 'white'
  },
  inputFocused: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  input: {
    flex: '1',
    border: 'none',
    padding: '16px 20px',
    fontSize: '1.1rem',
    outline: 'none',
    background: 'transparent'
  },
  addButton: {
    border: 'none',
    background: '#667eea',
    color: 'white',
    padding: '16px 24px',
    fontSize: '1.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px'
  },
  addIcon: {
    fontSize: '1.2rem',
    fontWeight: '300'
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '5px'
  },
  todosContainer: {
    padding: '0 30px 30px'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '40px',
    color: '#666',
    fontSize: '1.1rem'
  },
  loadingSpinner: {
    animation: 'spin 1s linear infinite'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '20px'
  },
  emptyText: {
    fontSize: '1.1rem',
    margin: '0'
  },
  todosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
};
