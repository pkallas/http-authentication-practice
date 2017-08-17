const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const port = process.env.NODE_ENV || 3000;
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

app.listen(port, () => {
  console.log(`Listening at localhost://${port} 🙌`)
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  console.log(request.cookies);
  console.log(request.session);
  // If a user is not signed in - there is no cookie - render the homepage
  if(!request.cookies){
    response.render('homepage');
  }
  // Else send a welcome back message
  else {
    response.send(`<p>Welcome Back ${request.session.email}</p>
      <p>There's nothing to do here but logout</p>
      <a href='/logout'>Logout</a>`);
  }
});

// Create a route for logout
app.get('/logout', (request, response, next) => {
  //if link is clicked, clear cookie-session
  response.clearCookie('session');
  next();
});

// Then redirect to homepage with no cookies
app.get('/logout', (request, response) => {
  response.redirect('/');
});

app.use(signupRouter);

app.use(loginRouter);
