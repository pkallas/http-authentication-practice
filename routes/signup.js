const express = require('express');
const signupRouter = express.Router();
const client = require('../pg');
const bcrypt = require('bcrypt');

// If no query error, render the page
signupRouter.get('/signup', (request, response) => {
  let errorObject = {
    noFormError: false,
    passwordsNotMatchingError: false,
    activeUserError: false,
  };
  // If you are logged in, redirect to the homepage
  if (request.session.email) {
    response.redirect('/');
  }
  // If no query error, render the page
  if (!request.query.err) {
    response.render('signup', errorObject)
  }
  // If the first, second, or third error handling occurred,
  // render the page plus the appropriate message
  else if (request.query.err === 'err1') {
    errorObject.noFormError = true;
    errorObject.message = 'Please provide and email and a password to sign up.';
    response.render('signup', errorObject)
  }
  else if (request.query.err === 'err2') {
    errorObject.passwordsNotMatchingError = true;
    errorObject.message = 'The passwords you entered do not match, please enter passwords again.';
    response.render('signup', errorObject)
  }
  else if (request.query.err === 'err3') {
    errorObject.activeUserError = true;
    response.render('signup', errorObject)
  }
});

signupRouter.post('/signup', (request, response, next) => {
  if(!request.body.email || !request.body.password || !request.body.confirmPassword) {
    console.log('Made it to the first error check in signup')
    // "Please provide an email and a password to sign up"
    response.redirect('/signup/?err=err1');
  }
  else if(request.body.password !== request.body.confirmPassword) {
    console.log('Made it to the second error check in signup');
    // 'The passwords you entered do not match, please enter passwords again'
    response.redirect('/signup/?err=err2');
  }
  else {
    let submittedEmail = request.body.email;
    let databaseEmail = [];
    let queryText = `SELECT email FROM users WHERE email='${submittedEmail}'`;
    /* Query the database to check if the user is already registered; if so, redirect
    the user back to the signup page, but with a link to the login page. If the user
    is not in the database, insert their email and hashed password into the database. */
    client.query(queryText)
    .then(result => {
      result.rows.map(formInput => {
        databaseEmail.push(formInput.email);
      })
    })
    .then(result => {
      if (databaseEmail.join('') === submittedEmail) {
      console.log('Made it to the third error check in signup');
      // 'Already an active user, please login'
      response.redirect('/signup/?err=err3');
      }
    })
    .then(result => {
      bcrypt.hash(request.body.password, 10).then(hash => {
        console.log('Hashed the password, attempting to insert data into the database');
        let insertText = 'INSERT INTO users(email, password) VALUES($1, $2)';
        let values = [submittedEmail, hash];
        client.query(insertText, values)
        .then(result => { console.log('Successfully added data to the database');
        next();
        })
    .catch(error => console.error(error.stack))
      });
    })
  }
})

// redirect to homepage with cookie now set, but first set the session to use

signupRouter.post('/signup', (request, response) => {
  request.session.email = request.body.email;
  response.redirect('/');
});

module.exports = signupRouter;
