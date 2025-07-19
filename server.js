console.log("Starting server.js...");
const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "examportal_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Helper function to check if user is admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login');
}

// ROUTES

// GET Home Page
app.get("/", (req, res) => {
  res.render("login");
});

// GET Signup Page
app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// POST Signup Form
app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
      [username, email, hashedPassword, role || 'student']
    );
    res.redirect("/login");
  } catch (err) {
    if (err.code === '23505') {
      // Duplicate email error
      return res.render("signup", { error: "This email is already registered. Please use a different email or log in." });
    }
    console.error("Signup Error:", err);
    res.send("Error occurred during signup.");
  }
});

// GET Login Page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST Login Form
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.render("login", { error: "Invalid email or password." });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password." });
    }

    req.session.user = user;
    if (user.role === 'admin') {
      res.redirect("/admin");
    } else {
      res.redirect("/assessments");
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.render("login", { error: "Error occurred during login." });
  }
});

// GET Exam Page
app.get("/exam", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // All questions (MCQ and Coding)
  const allQuestions = [
    {
      id: 1,
      type: "MCQ",
      question_text: "What is 2 + 2?",
      option_a: "3",
      option_b: "4",
      option_c: "5",
      option_d: "6"
    },
    {
      id: 2,
      type: "MCQ",
      question_text: "What is the capital of France?",
      option_a: "Berlin",
      option_b: "London",
      option_c: "Paris",
      option_d: "Rome"
    },
    {
      id: 3,
      type: "Coding",
      question_text: "Write a function to add two numbers.",
      sample_input: "2 3",
      sample_output: "5"
    },
    {
      id: 4,
      type: "Coding",
      question_text: "Write a function to reverse a string.",
      sample_input: "hello",
      sample_output: "olleh"
    }
  ];

  // Get type from query param (default to MCQ)
  const type = req.query.type || "MCQ";
  const questions = allQuestions.filter(q => q.type && q.type.toLowerCase() === type.toLowerCase());

  res.render("exam", { user: req.session.user, questions });
});

// POST Submit Exam (Example)
app.post("/submit-exam", (req, res) => {
  const { answers } = req.body;
  // Save the answers to the database here if needed
  res.render("thankyou");
});

// GET Assessments Page
app.get("/assessments", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  // Placeholder assessments data
  const assessments = [
    { id: 1, title: "MCQ Test", type: "MCQ", date: "2024-06-01", duration: "30 min" },
    { id: 2, title: "Coding Challenge", type: "Coding", date: "2024-06-02", duration: "1 hr" }
  ];
  res.render("assessments", { user: req.session.user, assessments });
});

// GET Profile Page
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

// GET Admin Dashboard
app.get("/admin", isAdmin, (req, res) => {
  res.render("admin", { user: req.session.user });
});

// GET Manage Assessments Page (Admin)
app.get("/admin/assessments", isAdmin, (req, res) => {
  res.render("manage_assessments", { user: req.session.user });
});

// GET View Results Page (Admin)
app.get("/admin/results", isAdmin, (req, res) => {
  res.render("view_results", { user: req.session.user });
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
