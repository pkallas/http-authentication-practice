const { Client } = require('pg');
const client = new Client({
  user: 'pkallas',
  host: 'localhost',
  database: 'http_authentication',
  port: '5432'
});

client.connect();

module.exports = client;
