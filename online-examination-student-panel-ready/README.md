# Online Examination System – Student Panel

A ready-to-run React + Vite frontend demo containing **only two student-facing screens**:

1. Available Exams
2. Start Exam

## Features included

- Premium, responsive student dashboard with OMR-inspired hero and exam cards
- Search exams and filter by subject using chips
- Start an exam from an available exam card
- Multiple-choice questions with selectable answers
- Countdown timer with automatic submission when time expires
- Previous / next question navigation
- Question palette with answered/current states
- Distraction-free CBT screen (sidebar hidden) with ring countdown timer
- Submit confirmation dialog and demo score calculation

## Tech stack

- React
- Vite
- CSS
- Lucide React icons

The repository also includes a placeholder `backend/` folder for future MERN API integration. The current demo runs entirely in the browser and does not require MongoDB or a backend.

## Run locally

1. Extract the ZIP.
2. Open the `frontend` folder in VS Code.
3. Open the terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build check

```bash
npm run build
```

## GitHub

From the project root:

```bash
git init
git add .
git commit -m "Add student panel exam UI"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your own repository URL.

## Note

This is a frontend demo using sample exam and question data. Authentication, persistent database storage, server-side evaluation, and real exam APIs are not implemented.
