const express = require("express");
const router = express.Router();
const { renderExam, submitExam } = require("../controllers/examController");

router.get("/", renderExam);
router.post("/submit", submitExam);

module.exports = router;
