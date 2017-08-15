const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const port = process.env.NODE_ENV || 3000;
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

app.listen(port, () => {
  console.log(`Listening at localhost://${port} 🙌`)
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(['key1', 'key2', 'key3', 'key4']));

app.get('/', (request, response) => {
  // If a user is not signed in - there is no cookie - render the homepage
  if(!request.cookies.session){
    response.render('homepage');
  }
  // Else send a welcome back message
  else {
    response.send(`<p>Welcome Back ${request.session}</p>
      <a href='./views/homepage'>Logout</a>`);
      //if link is clicked
      response.clearCookie('session');
      response.redirect('/');
  }
});

app.use(signupRouter);

app.use(loginRouter);
