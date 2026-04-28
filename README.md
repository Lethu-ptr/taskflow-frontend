# TaskFlow – Task Manager Web App

**INFS 202  Midterm Project , Option 1: Task Manager**

--

## Student Information

| Field        | Details                  |
|--------------|--------------------------|
| Student Name | Lethukuthula Shongwe      |
| Module       | INFS 202                 |
| Project      | React Web Application    |
| Option       | Option 1 – Task Manager  |



## Project Description

**TaskFlow** is a modern, fully responsive task management web application built with React. It allows users to create, view, edit, delete, and complete tasks — with full priority management, status tracking, category filtering, and due date handling. Data is persisted to `localStorage` so tasks survive page refreshes.



## Features

- **View tasks** — Browse all tasks on the List page with live search, status and priority filters, and sort options
- **Add new tasks** — Fully validated form with real-time error feedback
- **Edit tasks** — Inline edit form on the Detail page
- **Delete tasks** — With confirmation dialog
- **Mark complete** — One-click toggle directly from the task card or detail page
- **Priority levels** — High / Medium / Low with colour-coded badges
- **Categories** — Group tasks (Academic, Work, Personal, Study, etc.)
- **Due dates** — Overdue tasks are highlighted in red
- **Progress stats** — Overview bar showing totals, completion percentage
- **Persistent storage** — Tasks saved to `localStorage`
- **Responsive** — Works on mobile, tablet and desktop

---

## Technologies Used

| Technology        | Purpose                        |
|-------------------|-------------------------------|
| React 18          | Component-based UI framework  |
| React Router v6   | Client-side routing           |
| React Context API | Global state management       |
| CSS (custom)      | Styling & responsive layout   |
| Vite              | Build tool / dev server       |
| localStorage      | Data persistence              |



## React Components (6 total — minimum requirement: 5)

| Component      | Description                                      |
|----------------|--------------------------------------------------|
| `Navbar`       | Fixed navigation bar with mobile hamburger menu  |
| `TaskCard`     | Displays a task with actions(edit, delete, complete) |
| `StatsBar`     | Summary bar: total, pending, active, completed   |
| `SearchBar`    | Controlled search input with clear button        |
| `GenreFilter`  | Reusable filter chip group (status / category)   |
| `Toast`        | Ephemeral notification component                 |



## All Rubic Routes implemented

| Route           | Page           | Description                      |
|-----------------|----------------|----------------------------------|
| `/`             | Home Page      | Hero, stats overview, recent tasks |
| `/home`         | Home Page      | Same as `/` (rubric requirement) |
| `/list`         | List Page      | All tasks with filter + search   |
| `/tasks`        | List Page      | Alias for `/list`                |
| `/details/:id`  | Detail Page    | Full task info + edit form       |
| `/tasks/:id`    | Detail Page    | Alias for `/details/:id`         |
| `/add`          **Add Task Page  | New task form with validation    |



## Form Validation: Add Task Form

The Add Task form includes the following validation rules:

| Field       | Rules                                                      |
|-------------|-------------------------------------------------------------|
| Title       | Required · Minimum 3 characters · Maximum 100 characters   |
| Description | Optional · Maximum 500 characters                          |
| Priority    | Required — must select High, Medium, or Low                |
| Category    | Required                                                    |
| Due Date    | Optional — cannot be a past date                          |

- All inputs are **controlled components** (React state)
- Errors appear **on blur** and on submit
- Error messages use `role="alert"` for accessibility



## Project Structure

```
taskflow/
│
├── index.html
├── package.json
├── vite.config.js
├── README.md
│
└── src/
    ├── main.jsx               # App entry point
    ├── App.jsx                # Router + provider setup
    ├── index.css              # Global styles & CSS variables
    │
    ├── context/
    │   └── TaskContext.jsx    # Global task state (Context API)
    │
    ├── components/
    │   ├── Navbar.jsx / .css
    │   ├── TaskCard.jsx / .css
    │   ├── StatsBar.jsx / .css
    │   ├── SearchBar.jsx / .css
    │   ├── GenreFilter.jsx / .css
    │   └── Toast.jsx
    │
    └── pages/
        ├── HomePage.jsx / .css
        ├── ListPage.jsx / .css
        ├── DetailPage.jsx / .css
        └── AddTaskPage.jsx / .css
```



## How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher installed

### Steps

```bash
# 1. Extract the zip file and open the folder
cd taskflow

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser at:
#    http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

## Screenshots

![TaskFlow Home page](<Screenshots/Home page.png>)

![TaskFlow task list page](<Screenshots/Task list page.png>)

![TaskFlow add task form page](<Screenshots/Add Task Form.png>)

![TaskFlow task detail page](<Screenshots/Task detail(Exam preparations).png>)

---

## Academic Integrity

All code in this project was written by the student. The following external resources were used:

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Google Fonts – Plus Jakarta Sans & Syne](https://fonts.google.com)
- [Vite Documentation](https://vitejs.dev)

No code was copied from other students or unauthorised sources.
