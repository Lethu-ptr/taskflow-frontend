// ============================================================
//  TaskFlow – Navbar.jsx
//  Site-wide navigation with responsive hamburger + logout.
// ============================================================

import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',      label: 'Home',       end: true  },
  { to: '/tasks', label: 'My Tasks',   end: false },
  { to: '/add',   label: '+ Add Task', end: true, cta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout, tasks } = useAuth();

  // Count pending tasks for badge (tasks may not be in AuthContext —
  // the badge is optional; remove it if you don't pass tasks here)
  const pending = 0;

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Frosted nav on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Don't show nav links on the login page
  const isLoginPage = pathname === '/login';

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">

        {/* Logo */}
        <NavLink to="/" className="nav__logo">
          <span className="nav__logo-mark">✦</span>
          <span className="nav__logo-text">Task<em>Flow</em></span>
        </NavLink>

        {/* Desktop links — hidden on login page */}
        {!isLoginPage && user && (
          <nav className="nav__links">
            {NAV_LINKS.map(({ to, label, end, cta }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav__link ${isActive ? 'nav__link--active' : ''} ${cta ? 'nav__link--cta' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* User info + logout */}
            <div className="nav__user">
              <span className="nav__user-name">👤 {user.name}</span>
              <button className="nav__logout" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </nav>
        )}

        {/* Hamburger — hidden on login page */}
        {!isLoginPage && user && (
          <button
            className={`nav__burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(p => !p)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {!isLoginPage && user && (
        <div className={`nav__drawer ${open ? 'nav__drawer--open' : ''}`}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav__drawer-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="nav__drawer-footer">
            <span className="nav__drawer-user">👤 {user.name}</span>
            <button className="nav__drawer-logout" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
