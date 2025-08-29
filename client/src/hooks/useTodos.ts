import { useState, useCallback } from 'react';
import { Todo, TodoFormData, TodoUpdateData, ApiResponse } from '../types';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').trim();

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/todos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to load todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (title: string): Promise<Todo> => {
    try {
      const response = await fetch(`${API}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title } as TodoFormData)
      });

      if (!response.ok) {
        const errorData: ApiResponse<never> = await response.json();
        throw new Error(errorData.error || 'Failed to add todo');
      }

      const newTodo: Todo = await response.json();
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id: string, done: boolean): Promise<Todo> => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done } as TodoUpdateData)
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }

      const updatedTodo: Todo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTodoTitle = useCallback(async (id: string, title: string): Promise<Todo> => {
    try {
      const response = await fetch(`${API}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title } as TodoUpdateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo: Todo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
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
