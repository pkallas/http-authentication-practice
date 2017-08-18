const { Client } = require('pg');
const connectionString = 'postgres://pkallas@localhost:5432/http_authentication';
const client = new Client({
  connectionString: connectionString,
})
client.connect();

module.exports = client;
