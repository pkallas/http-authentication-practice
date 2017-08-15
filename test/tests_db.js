process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const client = require('../pg');
const insertIntoDB = require('../insert');
const queriesEmail = require('../queries').queriesEmail;
const queriesEmailPassword = require('../queries').queriesEmailPassword;
