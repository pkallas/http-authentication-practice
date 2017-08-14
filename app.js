const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const insertIntoDB = require('./insert');
const queries = require('./queries');
const port = process.env.NODE_ENV || 3000;

app.listen(port, () => {
  console.log(`Listening at localhost://${port} 🙌`)
})

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  if(!request.cookies.session){
    response.render('homepage');
  } else {
    response.send(`<p>Welcome Back ${request.cookies.session.email}</p>
      <a href='./views/homepage'>Logout</a>`);
      //if link is clicked
      // response.clearCookie('session')
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
  response.send('There was no email and password combination matching your input')
  }
});

// // set cookie-session
app.use(cookieSession({
  name: 'session',
  keys: [`${request.body.email}`, `${request.body.password}`],
  maxAge: 60 * 1000
}));

app.post('/login', (request, response, next) => {
  response.redirect('/');
})

app.post('/signup', (request, response, next) => {
  // check db, if email already exists, render 'That email already in use, please go to login'
  if(true) {
    response.redirect('/views/login' + 'That email already in use, please go to login')
  }
  // encrypt password
  // insert form data into database
  next()
});

// set cookie-session

app.use(cookieSession({
  name: 'session',
  keys: [`${request.body.email}`, `${request.body.password}`],
  maxAge: 60 * 1000
}));

app.post('/signup', (request, response) => {
  response.redirect('/');
});
