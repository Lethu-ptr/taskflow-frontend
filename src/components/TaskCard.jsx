//  Displays a single task in the list with actions


import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './TaskCard.css';

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABEL    = { pending: 'Pending', active: 'Active', completed: 'Done' };

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { toggleComplete, deleteTask } = useTasks();

  const isComplete = task.status === 'completed';

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
  }

  function handleToggle(e) {
    e.stopPropagation();
    toggleComplete(task.id);
  }

  const isOverdue =
    task.dueDate &&
    !isComplete &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <article
      className={`task-card ${isComplete ? 'task-card--done' : ''}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/tasks/${task.id}`)}
      aria-label={`Task: ${task.title}`}
    >
      {/* Checkbox */}
      <button
        className={`task-card__check ${isComplete ? 'checked' : ''}`}
        onClick={handleToggle}
        aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
      >
        {isComplete && <span>✓</span>}
      </button>

      {/* Content */}
      <div className="task-card__body">
        <div className="task-card__top">
          <h3 className={`task-card__title ${isComplete ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>
          <div className="task-card__badges">
            <span className={`badge badge-${task.priority}`}>
              {PRIORITY_LABEL[task.priority]}
            </span>
            <span className="task-card__status">
              <span className={`dot dot-${task.status}`} />
              {STATUS_LABEL[task.status]}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}

        <div className="task-card__footer">
          <span className="task-card__category">📁 {task.category || 'General'}</span>
          {task.dueDate && (
            <span className={`task-card__due ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? '⚠ ' : '📅 '}
              {new Date(task.dueDate).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-card__actions" onClick={e => e.stopPropagation()}>
        <button
          className="task-card__action-btn edit"
          onClick={e => { e.stopPropagation(); navigate(`/tasks/${task.id}`); }}
          aria-label="Edit task"
          title="Edit"
        >✎</button>
        <button
          className="task-card__action-btn delete"
          onClick={handleDelete}
          aria-label="Delete task"
          title="Delete"
        >✕</button>
      </div>
    </article>
  );
}
