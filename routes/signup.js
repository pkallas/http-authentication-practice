const express = require('express');
const signupRouter = express.Router();
const bodyParser = require('body-parser');
const client = require('../pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');

// If no query error, render the page
signupRouter.get('/signup', (request, response) => {
  if (!request.query.err) {
    response.render('signup', {
      noFormError: false,
      passwordsNotMatchingError: false,
      activeUserError: false
    })
  }
  // If the first, second, or third error handling occurred,
  // render the page plus the appropriate message
  else if (request.query.err === 'err1') {
    response.render('signup', {
      noFormError: true,
      passwordsNotMatchingError: false,
      activeUserError: false,
      message: 'Please provide an email and a password to sign up'
    })
  }
  else if (request.query.err === 'err2') {
    response.render('signup', {
      noFormError: false,
      passwordsNotMatchingError: true,
      activeUserError: false,
      message: 'The passwords you entered do not match, please enter passwords again'
    })
  }
  else if (request.query.err === 'err3') {
    response.render('signup', {
      noFormError: false,
      passwordsNotMatchingError: false,
      activeUserError: true
    })
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
    let databaseEmail = [];
    let submittedEmail = request.body.email
    let queryText = `SELECT email FROM users WHERE email='${submittedEmail}'`;
    /* Query the database to check if the user is already registered; if so, redirect
    the user back to the signup page, but with a link to the login page. If the user
    is not in the database, insert their email and hashed password into the database. */
    client.query(queryText)
    .then(result => {
      result.rows.map(formInput => {
        console.log(formInput.email);
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
      bcrypt.hash(request.body.password, saltRounds).then(hash => {
        console.log('Hashed the password, attempting to insert data into the database');
        let insertText = 'INSERT INTO users(email, password) VALUES($1, $2)';
        let values = [submittedEmail, hash];
        client.query(insertText, values)
        .then(result => { console.log('Successfully added data to the database');
        client.end();
        next();
        })
      .catch(error => console.error(error.stack))
      });
    })
  }
})

// set cookie-session

signupRouter.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// redirect to homepage with cookie now set, but first set the session to use

signupRouter.post('/signup', (request, response) => {
  request.session.email = response.cookie;
  response.redirect('/');
});

module.exports = signupRouter;
