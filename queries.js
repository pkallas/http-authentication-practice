const client = require('./pg');
const text = `SELECT email FROM users WHERE email=${input}`
const text2 = `SELECT (email, password) FROM users WHERE email=${input} AND password=${input2}`;

const queriesEmail = () => {client.query(text)
  .then(result => {
    result.rows.map(formInput => {
      client.end();
      return formInput.email
    })
  })
  .catch(error => console.log('There is no email that matches in the database'));
};

const queriesEmailPassword = () => {client.query(text2)
  .then(result => {
    result.rows.map(formInput => {
      client.end();
      return `${formInput.email}, ${formInput.password}`
    })
  })
  .catch(error => console.log('There is no email or password that matches that request'));
}

module.exports = {
  queriesEmail: queriesEmail,
  queriesEmailPassword: queriesEmailPassword
};
