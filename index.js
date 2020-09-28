const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");

// Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3000);
app.locals.title = "recipe";

// CRUD routes

// Mock route to test routing

app.get("/", function (req, res) {
  const f =
    "<html><head></head><body><form method='put' action='putrecipe'>ID:<input name='recipe_id' value='1'/><input name='description' value='Not found'/><input type='submit'/></form></body></html>";
  res.send(f);
});
app.get("/test", function (req, res) {
  res.send('{"id": 1, "test":"Hello"}');
});
//  Post Recipe
app.post("/recipeTest", async (req, res) => {
  try {
    console.log("recipeTest");
    const { description } = req.body;
    const json = `{"description": "${description}"}`;
    console.log("recipeTest-json:" + json);
    res.send(json);
    res.end();
    //res.json(newRecipe.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
app.post("/recipe", async (req, res) => {
  try {
    const { description } = req.body;
    console.log("posting to recipe");
    const newRecipe = await pool.query(
      "INSERT INTO recipe (owner, description) VALUES('test', $1) RETURNING *",
      [description]
    );
    console.log("post insert");
    res.json(newRecipe.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all recipes

app.get("/recipe", async (req, res) => {
  try {
    const allRecipes = await pool.query("SELECT * FROM recipe");
    res.json(allRecipes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get a recipe by ID

app.get("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await pool.query(
      "SELECT * FROM recipe WHERE recipe_id = $1",
      [id]
    );

    res.json(recipe.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a recipe

app.delete("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removeRecipe = await pool.query(
      "DELETE FROM recipe WHERE recipe_id = $1",
      [id]
    );
    console.log("Deleted " + id);
    res.json("Recipe deleted");
  } catch (error) {
    console.log(error.message);
  }
});

// Update a recipe

app.put("/recipe/:id/:description", async (req, res) => {
  try {
    const { id, description } = req.params;
    const updateRecipe = await pool.query(
      "UPDATE recipe SET description = $1 WHERE recipe_id = $2",
      [description, id]
    );
    console.log("updated " + description);
    res.json("recipe updated");
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = app;

