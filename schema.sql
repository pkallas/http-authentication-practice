DROP DATABASE IF EXISTS http_authentication;
CREATE DATABASE http_authentication;

\c http_authentication

DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  password VARCHAR(250)
);
