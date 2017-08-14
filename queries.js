const client = require('./pg');
const text = 'SELECT (email, password) FROM users WHERE email=input && password=input';

const queries = () => {client.query(text)
  .then(result => {

  })
  .catch(error => console.log('There is no email or password that matches that request'));
};

module.exports = queries;
