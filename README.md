# Student Exam Portal

A full-stack Node.js application for online exams with user authentication, MCQ and coding assessments, and real-time code execution.

## Features
- User registration and login (with validation)
- Assessment dashboard (MCQ and coding)
- Exam page with timer and tab switch detection
- Coding questions with in-browser code editor and Judge0 integration
- Result and thank you pages
- Clean, DRY, and well-structured codebase
- Unit tests for core logic

## Project Structure
```
controllers/      # Business logic
models/           # Database models
routes/           # Express routes
utils/            # Helpers (db, validation)
views/            # EJS templates
public/           # CSS/JS assets
```

## Setup
1. Clone the repo and run `npm install`.
2. Set up your `.env` file with your database connection string.
3. Run the database migrations (see `utils/db.js`).
4. Start the server: `npm start` or `node server.js`.
5. Run tests: `npm test`

## Requirements
- Node.js 16+
- PostgreSQL (or Neon)

## Author
Rohit