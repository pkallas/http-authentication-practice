DROP DATABASE IF EXISTS http_authentication_test;
CREATE DATABASE http_authentication_test;

\c todolist

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);
