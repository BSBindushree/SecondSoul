/**
 * validators.js
 * Simple synchronous input validation helpers
 */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  // At least 6 characters; adjust rules as needed
  return typeof password === 'string' && password.length >= 6;
}

function validateUsername(username) {
  return typeof username === 'string' && username.trim().length >= 3;
}

function validateProduct({ title, description, category, price }) {
  if (!title || title.trim().length < 3) return { valid: false, message: 'Title too short' };
  if (!category) return { valid: false, message: 'Category required' };
  if (isNaN(price) || price < 0) return { valid: false, message: 'Invalid price' };
  return { valid: true };
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateProduct
};
