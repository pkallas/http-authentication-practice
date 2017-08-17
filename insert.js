const client = require('./pg');
const text = 'INSERT INTO users (email, password) VALUES($1, $2)';


const insertIntoDB = (values) => {client.query(text, `${values}`)
  .then(res => { console.log('Successfully added data to the database')
  })
  .catch(error => console.error(error.stack))};

module.exports = insertIntoDB;
