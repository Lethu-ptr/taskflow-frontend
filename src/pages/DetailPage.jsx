//  TaskFlow – Detail Page  ( route: /tasks/:id )


import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './DetailPage.css';

const PRIORITY_COLOR = {
  high:   'var(--danger)',
  medium: 'var(--warn)',
  low:    'var(--lime)',
};

const STATUS_OPTIONS = ['pending', 'active', 'completed'];

export default function DetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { tasks, updateTask, deleteTask, toggleComplete } = useTasks();

  const task = tasks.find(t => t.id === id);

  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState(task || {});
  const [saved,   setSaved]   = useState(false);

  if (!task) {
    return (
      <div className="page">
        <div className="container">
          <div className="state-box">
            <span className="state-emoji">🔍</span>
            <p>Task not found.</p>
            <Link to="/tasks" className="btn btn-ghost btn-sm">← Back to Tasks</Link>
          </div>
        </div>
      </div>
    );
  }

  function handleSave() {
    // Basic validation
    if (!form.title?.trim()) return;
    updateTask(id, {
      title:       form.title.trim(),
      description: form.description?.trim() || '',
      priority:    form.priority,
      status:      form.status,
      category:    form.category?.trim() || 'General',
      dueDate:     form.dueDate || '',
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(id);
      navigate('/tasks');
    }
  }

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="page">
      <div className="container">
        <div className="detail-wrapper">

          {/* Breadcrumb */}
          <nav className="detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/tasks">My Tasks</Link>
            <span>/</span>
            <span>{task.title}</span>
          </nav>

          {/* Saved toast */}
          {saved && (
            <div className="detail-saved">✓ Changes saved</div>
          )}

          {/* Card */}
          <div className="card detail-card">

            {/* Header */}
            <div className="detail-header">
              <div className="detail-header__left">
                <div className="detail-meta-row">
                  <span className={`badge badge-${task.priority}`}>
                    {task.priority} priority
                  </span>
                  <span className="detail-status">
                    <span className={`dot dot-${task.status}`} />
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <span className="detail-category">📁 {task.category || 'General'}</span>
                </div>
                <h1 className="detail-title display">{task.title}</h1>
                <p className="detail-created">Created {createdDate}</p>
              </div>

              {/* Action buttons */}
              <div className="detail-header__actions">
                {!editing ? (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setForm({...task}); setEditing(true); }}>
                      ✎ Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleComplete(id)}
                      style={{ color: task.status === 'completed' ? 'var(--warn)' : 'var(--lime)' }}
                    >
                      {task.status === 'completed' ? '↩ Reopen' : '✓ Complete'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                      ✕ Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  </>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* Body — view or edit */}
            {!editing ? (
              <div className="detail-body">
                <div className="detail-field">
                  <span className="detail-field__label">Description</span>
                  <p className="detail-field__value">
                    {task.description || <em style={{color:'var(--txt-muted)'}}>No description provided.</em>}
                  </p>
                </div>

                <div className="detail-grid">
                  <div className="detail-field">
                    <span className="detail-field__label">Priority</span>
                    <span className="detail-field__value" style={{ color: PRIORITY_COLOR[task.priority] }}>
                      ● {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-field__label">Status</span>
                    <span className="detail-field__value">
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-field__label">Category</span>
                    <span className="detail-field__value">{task.category || 'General'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-field__label">Due Date</span>
                    <span className="detail-field__value">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form className="detail-edit-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    className={`form-input ${!form.title?.trim() ? 'error' : ''}`}
                    value={form.title || ''}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={form.description || ''}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Task description…"
                  />
                </div>
                <div className="detail-edit-row">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={form.priority || 'medium'}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={form.status || 'pending'}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      className="form-input"
                      value={form.category || ''}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      placeholder="e.g. Work, Study…"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      className="form-input"
                      type="date"
                      value={form.dueDate || ''}
                      onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Back link */}
          <Link to="/tasks" className="detail-back">← Back to Tasks</Link>
        </div>
      </div>
    </div>
  );
}
