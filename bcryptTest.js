const client = require('./pg');
const bcrypt = require('bcrypt');
const password = 'whatever';
const saltRounds = 10;
const insertText = 'INSERT INTO users(email, password) VALUES($1, $2)';
const queryText = `SELECT email, password FROM users WHERE email = 'hello@me.com'`;
let databaseEmailPassword = [];


bcrypt.hash(password, saltRounds)
  .then(hash => client.query(insertText, ['hello@me.com', hash]))
  .catch(error => console.log('There was an error 1'))
  .then(result => { console.log('Successfully added data to the database');
  })
  .then(() => client.query(queryText))
  .catch(error => console.log(error))
  .then(result => {
    console.log('Made it to the SELECT query');
    console.log(result);
    result.rows.map(formInput => {
      console.log(formInput.email);
      console.log(formInput.password);
      databaseEmailPassword.push(formInput.email);
      databaseEmailPassword.push(formInput.password);
      console.log(databaseEmailPassword);
      client.end();
    })
  })
  .catch(error => console.log(error))
  .then(result => bcrypt.compare(password, databaseEmailPassword[1]))
  .catch(error => console.log(error))
  .then(result => console.log(result));
