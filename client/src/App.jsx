import { useEffect, useState } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').trim();

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  async function load() {
    const res = await fetch(`${API}/api/todos`);
    setTodos(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    load();
  }

  async function toggle(id, done) {
    await fetch(`${API}/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done })
    });
    load();
  }

  async function remove(id) {
    await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <main style={{ maxWidth: 560, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Todos</h1>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a todo" />
        <button>Add</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t._id, t.done)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            <button onClick={() => remove(t._id)}>x</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
