// Input validation helpers

function validateEmail(email) {
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // At least 6 characters
  return typeof password === 'string' && password.length >= 6;
}

function validateUsername(username) {
  // Alphanumeric, 3-20 chars
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function validateExamSubmission(answers) {
  // Basic: answers should be an object or array
  return answers && typeof answers === 'object';
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateExamSubmission
}; 