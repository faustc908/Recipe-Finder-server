/*Set up migration*/

CREATE DATABASE recipe;

CREATE TABLE recipe
(
    recipe_id SERIAL PRIMARY KEY,
    description VARCHAR(700)
);