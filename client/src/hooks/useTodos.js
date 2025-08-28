import { useState, useCallback } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').trim();

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/todos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (title) => {
    try {
      const response = await fetch(`${API}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id, done) => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }

      const updatedTodo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTodoTitle = useCallback(async (id, title) => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    todos,
    loading,
    error,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoTitle
  };
}
