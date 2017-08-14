const client = require('./pg');
const text = 'INSERT INTO users(email, password) VALUES($1, $2)';
const values = [];

const insertIntoDB = () => {client.query(text, values)
  .then(res => {

  })
  .catch(error => console.error(error.stack))};

module.exports = insertIntoDB;
