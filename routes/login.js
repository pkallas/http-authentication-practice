const express = require('express');
const loginRouter = express.Router();
const bodyParser = require('body-parser');
const client = require('../pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');

loginRouter.get('/login', (request, response) => {
  // If no query error, render the page
  if (!request.query.err) {
    response.render('login', {
      error: false
    });
  }
  // If the first or second error handling occurred,
  // render the page plus the appropriate message
  else if (request.query.err === 'err1') {
    response.render('login', {
      error: true,
      message: 'Please provide an email and a password to login.'
    })
  }
  else if (request.query.err === 'err2') {
    response.render('login', {
      error: true,
      message: 'The email or password was incorrect. Please try again.'
    })
  }
});

loginRouter.post('/login', (request, response, next) => {
  if(!request.body.email || !request.body.password){
    // "Please provide an email and a password to login"
    response.redirect('/login/?err=err1')
  }
  /* If the user did submit values in the forms, check the database to see if
  the email and password combination provided match what's in the database
  */
  else{
    let databaseEmailPassword = [];
    let submittedEmail = request.body.email;
    let submittedPassword = request.body.password;
    let queryText = `SELECT email, password FROM users WHERE email = '${submittedEmail}'`;
    client.query(queryText)
    .then(result => {
      result.rows.map(formInput => {
        databaseEmailPassword.push(formInput.email);
        databaseEmailPassword.push(formInput.password);
        client.end();
      })
    })
    .catch(error => response.redirect('/login/?err=err2'))
    .then(result => bcrypt.compare(submittedPassword, databaseEmailPassword[1]))
    .then(result => {
      if (true) {
        next();
      }
      else {
        response.redirect('/login/?err=err2');
      }
    })
    .catch(error => {
      console.error(error.stack);
    })
  }
});

// set cookie-session

loginRouter.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3', 'key4']
}));

// redirect to homepage with cookie now set, but first set the session to use

loginRouter.post('/login', (request, response, next) => {
  request.session.email = response.cookie;
  response.redirect('/');
})

module.exports = loginRouter;
