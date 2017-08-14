const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const port = process.env.NODE_ENV || 3000;

app.listen(port, () => {
  console.log(`Listening at localhost://${port} 🙌`)
})
