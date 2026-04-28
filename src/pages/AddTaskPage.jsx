//  Fully validated controlled form


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './AddTaskPage.css';

// Validation rules
function validate(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = 'Title is required.';
  } else if (form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (form.title.trim().length > 100) {
    errors.title = 'Title must be under 100 characters.';
  }

  if (form.description && form.description.length > 500) {
    errors.description = 'Description must be under 500 characters.';
  }

  if (!form.priority) {
    errors.priority = 'Please select a priority level.';
  }

  if (!form.category.trim()) {
    errors.category = 'Category is required.';
  }

  if (form.dueDate) {
    const due  = new Date(form.dueDate);
    const today = new Date(new Date().toDateString());
    if (due < today) {
      errors.dueDate = 'Due date cannot be in the past.';
    }
  }

  return errors;
}

const INITIAL_FORM = {
  title:       '',
  description: '',
  priority:    '',
  category:    '',
  dueDate:     '',
};

const CATEGORIES = ['Academic', 'Work', 'Personal', 'Health', 'Finance', 'Study', 'Other'];

export default function AddTaskPage() {
  const navigate    = useNavigate();
  const { addTask } = useTasks();

  const [form,     setForm]     = useState(INITIAL_FORM);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [success,  setSuccess]  = useState(false);

  // Field change handler
  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error on edit if field was touched
    if (touched[field]) {
      const updated = { ...form, [field]: value };
      const newErrors = validate(updated);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] || undefined }));
    }
  }

  // Mark field as touched on blur, run its validation
  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] || undefined }));
  }

  // Submit
  function handleSubmit(e) {
    e.preventDefault();
    // Touch all fields
    setTouched({ title: true, description: true, priority: true, category: true, dueDate: true });
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newId = addTask({
      title:       form.title.trim(),
      description: form.description.trim(),
      priority:    form.priority,
      category:    form.category.trim(),
      dueDate:     form.dueDate,
    });

    setSuccess(true);
    setTimeout(() => navigate(`/tasks/${newId}`), 1200);
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
  }

  const charCount = form.description.length;

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="add-success">
            <div className="add-success__icon">✓</div>
            <h2>Task Created!</h2>
            <p>Redirecting you to your new task…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="add-wrapper">

          {/* Header */}
          <div className="add-header">
            <div>
              <h1 className="display add-title">Add New Task</h1>
              <p className="add-sub">Fill in the details below. Fields marked * are required.</p>
            </div>
            <Link to="/tasks" className="btn btn-ghost btn-sm">← Cancel</Link>
          </div>

          {/* Form */}
          <div className="card add-card">
            <form onSubmit={handleSubmit} noValidate>

              {/* Title */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">Task Title *</label>
                <input
                  id="title"
                  type="text"
                  className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  onBlur={() => handleBlur('title')}
                  placeholder="e.g. Complete project report"
                  maxLength={100}
                  aria-required="true"
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {touched.title && errors.title && (
                  <span id="title-error" className="field-error" role="alert">⚠ {errors.title}</span>
                )}
                <span className="add-char-count">{form.title.length}/100</span>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="desc" className="form-label">Description</label>
                <textarea
                  id="desc"
                  className={`form-textarea ${touched.description && errors.description ? 'error' : ''}`}
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe the task in detail…"
                  maxLength={500}
                  aria-describedby={errors.description ? 'desc-error' : undefined}
                />
                {touched.description && errors.description && (
                  <span id="desc-error" className="field-error" role="alert">⚠ {errors.description}</span>
                )}
                <span className="add-char-count">{charCount}/500</span>
              </div>

              {/* Priority + Category row */}
              <div className="add-row">
                <div className="form-group">
                  <label htmlFor="priority" className="form-label">Priority *</label>
                  <select
                    id="priority"
                    className={`form-select ${touched.priority && errors.priority ? 'error' : ''}`}
                    value={form.priority}
                    onChange={e => handleChange('priority', e.target.value)}
                    onBlur={() => handleBlur('priority')}
                    aria-required="true"
                    aria-describedby={errors.priority ? 'priority-error' : undefined}
                  >
                    <option value="">Select priority…</option>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                  {touched.priority && errors.priority && (
                    <span id="priority-error" className="field-error" role="alert">⚠ {errors.priority}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <input
                    id="category"
                    type="text"
                    className={`form-input ${touched.category && errors.category ? 'error' : ''}`}
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    onBlur={() => handleBlur('category')}
                    placeholder="e.g. Work, Study…"
                    list="category-suggestions"
                    aria-required="true"
                    aria-describedby={errors.category ? 'category-error' : undefined}
                  />
                  <datalist id="category-suggestions">
                    {CATEGORIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                  {touched.category && errors.category && (
                    <span id="category-error" className="field-error" role="alert">⚠ {errors.category}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    className={`form-input ${touched.dueDate && errors.dueDate ? 'error' : ''}`}
                    value={form.dueDate}
                    onChange={e => handleChange('dueDate', e.target.value)}
                    onBlur={() => handleBlur('dueDate')}
                    aria-describedby={errors.dueDate ? 'due-error' : undefined}
                  />
                  {touched.dueDate && errors.dueDate && (
                    <span id="due-error" className="field-error" role="alert">⚠ {errors.dueDate}</span>
                  )}
                </div>
              </div>

              {/* Priority preview */}
              {form.priority && (
                <div className={`add-preview add-preview--${form.priority}`}>
                  <span className={`badge badge-${form.priority}`}>{form.priority} priority</span>
                  <span className="add-preview__hint">
                    {form.priority === 'high'   && 'This task will be highlighted and shown first.'}
                    {form.priority === 'medium' && 'Standard priority. Will appear in normal order.'}
                    {form.priority === 'low'    && 'Low urgency. Can be done whenever time allows.'}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="add-actions">
                <button type="submit" className="btn btn-primary">
                  ✦ Create Task
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleReset}>
                  ↺ Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
