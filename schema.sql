DROP DATABASE IF EXISTS http_authentication;
CREATE DATABASE http_authentication;

\c todolist

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  password VARCHAR(50)
);
