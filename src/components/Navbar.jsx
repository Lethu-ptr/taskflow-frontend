//  TaskFlow – Navbar Component


import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './Navbar.css';

const LINKS = [
  { to: '/',      label: 'Home',     end: true },
  { to: '/tasks', label: 'My Tasks', end: false },
  { to: '/add',   label: '+ Add Task', end: true, cta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const { pathname } = useLocation();
  const { tasks }    = useTasks();

  const pending = tasks.filter(t => t.status !== 'completed').length;

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        {/* Logo */}
        <NavLink to="/" className="nav__logo">
          <span className="nav__logo-mark">✦</span>
          <span className="nav__logo-text">Task<em>Flow</em></span>
        </NavLink>

        {/* Desktop links */}
        <nav className="nav__links">
          {LINKS.map(({ to, label, end, cta }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--active' : ''} ${cta ? 'nav__link--cta' : ''}`
              }
            >
              {label}
              {to === '/tasks' && pending > 0 && (
                <span className="nav__badge">{pending}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`nav__burger ${open ? 'open' : ''}`}
          onClick={() => setOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav__drawer ${open ? 'nav__drawer--open' : ''}`}>
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            className={({ isActive }) =>
              `nav__drawer-link ${isActive ? 'active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
