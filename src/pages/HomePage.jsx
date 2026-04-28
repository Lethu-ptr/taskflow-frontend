//  TaskFlow – Home Page  ( route: / )


import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import StatsBar from '../components/StatsBar';
import TaskCard from '../components/TaskCard';
import './HomePage.css';

export default function HomePage() {
  const { tasks } = useTasks();

  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero__text">
            <p className="home-hero__eyebrow">✦ Your productivity hub</p>
            <h1 className="home-hero__title display">
              Get things<br />
              <span className="home-hero__accent">done.</span>
            </h1>
            <p className="home-hero__sub">
              Track tasks, set priorities, and hit every deadline.
              Simple. Focused. Effective.
            </p>
            <div className="home-hero__cta">
              <Link to="/add" className="btn btn-primary">+ Add a Task</Link>
              <Link to="/tasks" className="btn btn-ghost">View All Tasks</Link>
            </div>
          </div>
          <div className="home-hero__visual" aria-hidden="true">
            <div className="hero-orb hero-orb--1" />
            <div className="hero-orb hero-orb--2" />
            <div className="hero-card">
              <div className="hero-card__line" />
              <div className="hero-card__line short" />
              <div className="hero-card__line shorter" />
              <div className="hero-card__check">✓</div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section">
          <h2 className="home-section-title">Overview</h2>
          <StatsBar />
        </section>

        <div className="divider" />

        {/* Recent tasks */}
        <section className="section">
          <div className="home-row-header">
            <h2 className="home-section-title">Recent Tasks</h2>
            <Link to="/tasks" className="home-see-all">See all →</Link>
          </div>

          {recent.length === 0 ? (
            <div className="state-box">
              <span className="state-emoji">📋</span>
              <p>No tasks yet. <Link to="/add" style={{color:'var(--accent)'}}>Add your first one!</Link></p>
            </div>
          ) : (
            <div className="home-task-list">
              {recent.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </section>

        {/* Quick tips */}
        <section className="section">
          <h2 className="home-section-title">How it works</h2>
          <div className="home-tips">
            {[
              { icon: '✦', title: 'Add Tasks', desc: 'Create tasks with title, description, priority, category and due date.' },
              { icon: '⟳', title: 'Track Status', desc: 'Move tasks from Pending → Active → Complete as you work.' },
              { icon: '✓', title: 'Stay on top', desc: 'Filter by category or priority. Never miss a deadline again.' },
            ].map(tip => (
              <div className="home-tip" key={tip.title}>
                <span className="home-tip__icon">{tip.icon}</span>
                <h3 className="home-tip__title">{tip.title}</h3>
                <p className="home-tip__desc">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
