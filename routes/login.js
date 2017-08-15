const express = require('express');
const loginRouter = express.Router();
const bodyParser = require('body-parser');
const client = require('../pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');
const errorMessagesLogin = {
  err1: 'Please provide an email and a password to login',
  err2: 'There was no email and password combination matching your input'
};

const queryText = `SELECT (email, password) FROM users WHERE email=${input} AND password=${input2}`;

// This is a promise to query the db for a given email and password
const queriesEmailPassword = () => {client.query(queryText)
  .then(result => {
    result.rows.map(formInput => {
      client.end();
      return `${formInput.email}, ${formInput.password}`
    })
  })
  .catch(error => console.log('There is no email or password that matches that request'));
}

//Create middleware function to use later to set a cookie
const setCookie = (request, response, next) => {cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3', 'key4'],
  maxAge: 60 * 1000
});
  next();
};

loginRouter.get('/login', (request, response) => {
  // If no query error, render the page
  if (!request.query) {
    response.render('login');
  }
  // If the first or second error handling occurred,
  // render the page plus the appropriate message
  else {
    response.render('login', errorMessagesLogin)
  }
});

loginRouter.post('/login', (request, response, next) => {
  if(!request.body.email || !request.body.password){
    // refactor to redirect to login and include lower message --> Done
    // "Please provide an email and a password to login"
    response.redirect('/login/?err=err1')
  }
  // get data from db
  let input = request.body.email;
  let input2 = request.body.password;
  let emailPasswordArray = queriesEmailPassword();
  let email = emailPasswordArray[0];
  let encryptedPassword = emailPasswordArray[1];
  bcrypt.compare(input2, encryptedPassword).then(result => {
    if (input === email && input2 === password) {
      next();
    }
    else {
  // refactor to redirect to login and include lower message --> Done
  // 'There was no email and password combination matching your input'
      response.redirect('/login/?err=err2');
    }
  })
  .catch(error => {
    console.error(error.stack);
  })
});

// // set cookie-session
loginRouter.use('/login', setCookie);

// redirect to homepage with cookie now set, but first set the session to use

loginRouter.post('/login', (request, response, next) => {
  request.session.email = `${request.body.email}`
  response.redirect('/');
})

module.exports = loginRouter;
