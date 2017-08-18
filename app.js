const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const port = process.env.NODE_ENV || 3000;
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

if (process.env.NODE_ENV === 'test'){
  app.EXPRESS_APP = true;
  module.exports = app;
} else app.listen(3000, () => {
    console.log('http://localhost:3000')
});

app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  secret: 'reallyLongKey930284iq3849q23pufndsja8rpq'
}));

app.get('/', (request, response) => {
  !request.session.email ? User = 'Stranger' : User = request.session.email
  response.render('homepage', { User });
});

// Create a route for logout, then redirect to homepage with no cookies
app.get('/logout', (request, response) => {
  request.session = null;
  response.redirect('/');
});

app.use(bodyParser.urlencoded({ extended: false }));

// Routes for signup page
app.use(signupRouter);

// Routes for login page
app.use(loginRouter);
