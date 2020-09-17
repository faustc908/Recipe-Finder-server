const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./pgInfo");

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.post("/recipe", async (req, res) => {
  try {
    const { description } = req.body;
    const newRecipe = await pool.query(
      "INSERT INTO recipe (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newRecipe.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// get all recipes

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await pool.query("SELECT * FROM recipe");
    res.json(allRecipes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get a recipe by ID

app.get("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await pool.query("SELECT * FROM todo WHERE recipe_id = $1", [
      id,
    ]);

    res.json(recipe.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// delete a recipe

app.delete("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removeRecipe = await pool.query(
      "DELETE FROM recipe WHERE recipe_id = $1",
      [id]
    );
    res.json("Recipe deleted");
  } catch (error) {
    console.log(error.message);
  }
});

// update a recipe

app.put("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateRecipe = await pool.query(
      "UPDATE recipe SET description = $1 WHERE recipe_id = $2",
      [description, id]
    );

    res.json("recipe update");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(8000, () => {
  console.log("server is up on port 8000");
});
