const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const client = require('./pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const queriesEmail = require('./queries').queriesEmail;
const queriesEmailPassword = require('./queries').queriesEmailPassword;
const port = process.env.NODE_ENV || 3000;

const setCookie = (request, response, next) => {cookieSession({
  name: 'session',
  keys: `${request.body.email}`,
  maxAge: 60 * 1000
});
  next();
};

app.listen(port, () => {
  console.log(`Listening at localhost://${port} 🙌`)
});

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  if(!request.cookies.session){
    response.render('homepage');
  } else {
    response.send(`<p>Welcome Back ${request.cookies.session.keys}</p>
      <a href='./views/homepage'>Logout</a>`);
      //if link is clicked
      response.clearCookie('session')
  }
});

app.get('/signup', (request, response) => {
  response.render('signup');
});

app.get('/login', (request, response) => {
  response.render('login');
});

app.post('/login', (request, response, next) => {
  // get data from db
  if (request.body.email && request.body.password === db.email && db.password) {
  next()
  } else {
  // refactor to redirect to login and include lower message
  response.send('There was no email and password combination matching your input')
  }
});

// // set cookie-session
app.use('/login', setCookie);

app.post('/login', (request, response, next) => {
  response.redirect('/');
})

app.post('/signup', (request, response, next) => {
  if(!request.body.email || !request.body.password || !request.body.confirmPassword){
    // "Please provide an email and a password to sign up"
    response.redirect('/signup' + textAbove)
  }
  if(request.body.password !== request.body.confirmPassword) {
    // 'The passwords you entered do not match, please enter passwords again'
    response.redirect('/signup' + textAbove)
  }
  // check db, if email already exists, render 'That email already in use, please go to login'
  let input = request.body.email;
  let userEmail = queriesEmail();
  if(userEmail.join('') === input) {
    // 'Already an active user, please login'
    response.redirect('/login' + textAbove)
  }
  // encrypt password
  else {
    bcrypt.hash(request.body.password, saltRounds).then(result => {
      // insert form data into database
      let text = 'INSERT INTO users(email, password) VALUES($1, $2)';
      let values = [request.body.email, request.body.password];
      client.query(text, values)
        .then(res => { console.log('Successfully added data to the database');
        client.end();
        })
        .catch(error => console.error(error.stack))};
    })
  next()
});

// set cookie-session

app.use('/signup', setCookie);

app.post('/signup', (request, response) => {
  response.redirect('/');
});
