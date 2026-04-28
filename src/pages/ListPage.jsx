//  TaskFlow – List Page  ( route: /tasks )


import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';
import './ListPage.css';

const STATUS_FILTERS   = ['all', 'pending', 'active', 'completed'];
const PRIORITY_FILTERS = ['all', 'high', 'medium', 'low'];

export default function ListPage() {
  const { tasks } = useTasks();
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [priority, setPriority] = useState('all');
  const [sort,     setSort]     = useState('newest');

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }
    if (status !== 'all')   list = list.filter(t => t.status === status);
    if (priority !== 'all') list = list.filter(t => t.priority === priority);

    list.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sort === 'due') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    return list;
  }, [tasks, search, status, priority, sort]);

  return (
    <div className="page">
      <div className="container">
        <section className="section">
          {/* Header */}
          <div className="list-header">
            <div>
              <h1 className="display list-title">My Tasks</h1>
              <p className="list-sub">{tasks.length} tasks · {filtered.length} shown</p>
            </div>
            <Link to="/add" className="btn btn-primary">+ New Task</Link>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: 28 }}>
            <StatsBar />
          </div>

          {/* Toolbar */}
          <div className="list-toolbar">
            {/* Search */}
            <div className="list-search">
              <span className="list-search__icon">🔍</span>
              <input
                type="search"
                className="list-search__input"
                placeholder="Search tasks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
              {search && (
                <button className="list-search__clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="list-filters">
              {/* Status filter */}
              <select
                className="form-select list-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                {STATUS_FILTERS.map(s => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {/* Priority filter */}
              <select
                className="form-select list-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                aria-label="Filter by priority"
              >
                {PRIORITY_FILTERS.map(p => (
                  <option key={p} value={p}>
                    {p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="form-select list-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort tasks"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="priority">Priority</option>
                <option value="due">Due date</option>
              </select>
            </div>
          </div>

          {/* Task list */}
          {filtered.length === 0 ? (
            <div className="state-box">
              <span className="state-emoji">🔎</span>
              <p>No tasks match your filters.</p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(''); setStatus('all'); setPriority('all'); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="list-task-list">
              {filtered.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
