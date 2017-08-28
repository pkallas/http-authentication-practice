const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://pkallas@localhost:5432/http_authentication'
})
client.connect();

module.exports = client;
