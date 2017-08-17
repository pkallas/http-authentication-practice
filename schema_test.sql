DROP DATABASE IF EXISTS http_authentication_test;
CREATE DATABASE http_authentication_test;

\c http_authentication_test

DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  password VARCHAR(50)
);
