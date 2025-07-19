const pool = require("../db");

exports.renderExam = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const q = await pool.query("SELECT * FROM questions");
  res.render("exam", { questions: q.rows });
};

exports.submitExam = async (req, res) => {
  const userId = req.session.userId;
  const submitted = req.body;
  const questions = await pool.query("SELECT * FROM questions");
  let score = 0;

  for (let q of questions.rows) {
    const userAns = submitted[`q${q.id}`];
    const correct = userAns === q.correct_option;
    if (correct) score++;

    await pool.query(
      "INSERT INTO answers (user_id, question_id, selected_option, is_correct) VALUES ($1, $2, $3, $4)",
      [userId, q.id, userAns, correct]
    );
  }

  res.render("result", { score, total: questions.rows.length });
};
