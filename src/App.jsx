// ============================================================
//  TaskFlow – App.jsx
//  Sets up all routes and wraps the app in Auth + Task providers.
//  PrivateRoute redirects to /login if the user is not logged in.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider }          from './context/TaskContext';
import Navbar      from './components/Navbar';
import HomePage    from './pages/HomePage';
import ListPage    from './pages/ListPage';
import DetailPage  from './pages/DetailPage';
import AddTaskPage from './pages/AddTaskPage';
import LoginPage   from './pages/LoginPage';
import './index.css';

// ── Guard: redirect to /login if not authenticated ────────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking saved token — show a spinner
  if (loading) {
    return (
      <div className="page">
        <div className="state-box">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>

            {/* ── Public route ── */}
            <Route path="/login" element={<LoginPage />} />

            {/* ── Protected routes ── */}
            <Route path="/" element={
              <PrivateRoute><HomePage /></PrivateRoute>
            } />
            <Route path="/tasks" element={
              <PrivateRoute><ListPage /></PrivateRoute>
            } />
            <Route path="/tasks/:id" element={
              <PrivateRoute><DetailPage /></PrivateRoute>
            } />
            <Route path="/add" element={
              <PrivateRoute><AddTaskPage /></PrivateRoute>
            } />

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}
