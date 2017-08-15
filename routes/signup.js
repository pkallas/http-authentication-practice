const express = require('express');
const signupRouter = express.Router();
const bodyParser = require('body-parser');
const client = require('../pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');
const queryText = `SELECT email FROM users WHERE email=${input}`;
const errorMessagesSignUp = {
  err1: 'Please provide an email and a password to sign up',
  err2: 'The passwords you entered do not match, please enter passwords again',
  err3: 'Already an active user, please login'
};

// This is a promise to query the db for a given email
const queriesEmail = () => {client.query(queryText)
  .then(result => {
    result.rows.map(formInput => {
      client.end();
      return formInput.email
    })
  })
  .catch(error => console.log('There is no email that matches in the database'));
};

//Create middleware function to use later to set a cookie
const setCookie = (request, response, next) => {cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3', 'key4'],
  maxAge: 60 * 1000
});
  next();
};

signupRouter.get('/signup', (request, response) => {
  // If no query error, render the page
  if (!request.query) {
    response.render('signup');
  }
  // If the first, second, or third error handling occurred,
  // render the page plus the appropriate message
  else {
    response.render('signup', errorMessagesSignUp)
  }
});

signupRouter.post('/signup', (request, response, next) => {
  if(!request.body.email || !request.body.password || !request.body.confirmPassword){
    // "Please provide an email and a password to sign up"
    // Refactor to include above text along with redirect --> Done
    response.redirect('/signup/?err=err1');
  }
  if(request.body.password !== request.body.confirmPassword) {
    // 'The passwords you entered do not match, please enter passwords again'
    // Refactor to include above text along with redirect --> Done
    response.redirect('/signup/?err=err2');
  }
  // check db, if email already exists, render 'That email already in use, please go to login'
  let input = request.body.email;
  let userEmail = queriesEmail();
  if(userEmail.join('') === input) {
    // 'Already an active user, please login'
    // Refactor to include above text along with redirect --> Done
    response.redirect('/signup/?err=err3');
  }
  // encrypt password
  else {
    bcrypt.hash(request.body.password, saltRounds).then(hash => {
      // insert form data into database
      let insertText = 'INSERT INTO users(email, password) VALUES($1, $2)';
      let values = [request.body.email, hash];
      client.query(insertText, values)
        .then(res => { console.log('Successfully added data to the database');
        client.end();
        })
        .catch(error => console.error(error.stack))};
    })
  next();
});

// set cookie-session

signupRouter.use('/signup', setCookie);

// redirect to homepage with cookie now set, but first set the session to use

signupRouter.post('/signup', (request, response) => {
  request.session.email = `${request.body.email}`
  response.redirect('/');
});

module.exports = signupRouter;
