const express = require('express');
const loginRouter = express.Router();
const client = require('../pg');
const bcrypt = require('bcrypt');

loginRouter.get('/login', (request, response) => {
  let errorObject = {
    error: false,
    message: ""
  };
  // If you are logged in, redirect to the homepage
  if (request.session.email) {
    response.redirect('/');
  }
  // If no query error, render the page
  if (!request.query.err) {
    response.render('login', errorObject);
  }
  // If the first or second error handling occurred,
  // render the page plus the appropriate message
  else if (request.query.err === 'err1') {
    errorObject.error = true;
    errorObject.message = 'Please provide an email and a password to login.';
    response.render('login', errorObject);
  }
  else if (request.query.err === 'err2') {
    errorObject.error = true;
    errorObject.message = 'Your email or password was incorrect, please try again.';
    response.render('login', errorObject);
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
    let databasePassword = [];
    let queryText = `SELECT email, password FROM users WHERE email = '${request.body.email}'`;
    client.query(queryText)
    .then(result => {
      result.rows.map(formInput => {
        databasePassword.push(formInput.password)
      })
    })
    .then(result => bcrypt.compare(request.body.password, databasePassword[0]))
    .catch(error => response.redirect('/login/?err=err2'))
    .then(result => {
      if (result === true) {
        next();
      }
      else {
        response.redirect('/login/?err=err2');
      }
    })
    .catch(error => response.redirect(console.error(error)))
  }
});

// redirect to homepage with cookie now set, but first set the session to use

loginRouter.post('/login', (request, response, next) => {
  request.session.email = request.body.email;
  response.redirect('/');
})

module.exports = loginRouter;
