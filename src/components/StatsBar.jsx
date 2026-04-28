//  Summary counts for tasks — used on Home & List pages


import { useTasks } from '../context/TaskContext';
import './StatsBar.css';

export default function StatsBar() {
  const { tasks } = useTasks();

  const total     = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const active    = tasks.filter(t => t.status === 'active').length;
  const pending   = tasks.filter(t => t.status === 'pending').length;
  const pct       = total ? Math.round((completed / total) * 100) : 0;

  const STATS = [
    { label: 'Total',     value: total,     color: 'var(--txt-sub)'  },
    { label: 'Pending',   value: pending,   color: 'var(--warn)'     },
    { label: 'Active',    value: active,    color: 'var(--accent)'   },
    { label: 'Completed', value: completed, color: 'var(--lime)'     },
  ];

  return (
    <div className="stats-bar">
      {STATS.map(s => (
        <div className="stats-bar__item" key={s.label}>
          <span className="stats-bar__value" style={{ color: s.color }}>
            {s.value}
          </span>
          <span className="stats-bar__label">{s.label}</span>
        </div>
      ))}

      {/* Progress */}
      <div className="stats-bar__progress-wrap">
        <div className="stats-bar__progress-header">
          <span className="stats-bar__label">Progress</span>
          <span className="stats-bar__pct">{pct}%</span>
        </div>
        <div className="stats-bar__track">
          <div
            className="stats-bar__fill"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}
