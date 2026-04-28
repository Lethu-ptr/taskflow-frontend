//  TaskFlow – TaskContext
//  Global task state, persisted to localStorage.
//  Provides: tasks, addTask, updateTask, deleteTask, toggleComplete


import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext(null);

// Seed data shown on first launch 
const SEED_TASKS = [
  {
    id: '1',
    title: 'Research React Router v6',
    description: 'Read the official docs and understand nested routes, loaders, and the new data APIs.',
    priority: 'high',
    status: 'completed',
    category: 'Study',
    dueDate: '2025-05-01',
    createdAt: new Date('2025-04-20').toISOString(),
  },

  {
    id: '2',
    title: 'Build INFS 202 midterm project',
    description: 'Develop the TaskFlow web app using React, React Router, and CSS. Submit before Week 10 deadline.',
    priority: 'high',
    status: 'active',
    category: 'Academic',
    dueDate: '2025-05-15',
    createdAt: new Date('2025-04-22').toISOString(),
  },

  {
    id: '3',
    title: 'Revise component structure notes',
    description: 'Go over lecture slides on component-based architecture and reusable patterns.',
    priority: 'medium',
    status: 'pending',
    category: 'Study',
    dueDate: '2026-05-10',
    createdAt: new Date('2026-04-23').toISOString(),
  },
  
  {
    id: '4',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, coffee, fruit.',
    priority: 'low',
    status: 'pending',
    category: 'Personal',
    dueDate: '',
    createdAt: new Date('2026-04-24').toISOString(),
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      return saved ? JSON.parse(saved) : SEED_TASKS;
    } catch {
      return SEED_TASKS;
    }
  });

  // Persist every change
  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask.id;
  }, []);

  const updateTask = useCallback((id, changes) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...changes } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'active' : 'completed' }
          : t
      )
    );
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside <TaskProvider>');
  return ctx;
}
