DROP DATABASE IF EXISTS http_authentication;
CREATE DATABASE http_authentication;

\c todolist

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);
