const db = require("../db");
const request = require("supertest");
const app = require("../index");

beforeAll(async () => {
  // create recipe table
  await db.query(
    "CREATE TABLE recipe (recipe_id SERIAL PRIMARY KEY, description VARCHAR(1000))"
  );
});

beforeEach(async () => {
  // seed with some data
  await db.query(
    "INSERT INTO recipe (description) VALUES ('Tomato'), ('Brocolli')"
  );
});

afterEach(async () => {
  await db.query("DELETE FROM recipe");
});

afterAll(async () => {
  await db.query("DROP TABLE recipe");
  db.end();
});

// Testing endpoint responses and properties

// Test get recipe route

describe("GET /recipe", () => {
  test("It should fetch our recipes", async (done) => {
    const response = await request(app).get("/recipe");
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("recipe_id");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.statusCode).toBe(200);
    done();
  });
});

// Test post recipe route

describe("POST /recipe", () => {
  test("It should post recipes", async (done) => {
    const newRecipe = await request(app).post("/recipe").send({
      description: "Broccoli is good",
    });
    expect(newRecipe.body.description).toBe("Broccoli is good");
    expect(newRecipe.body).toHaveProperty("recipe_id");
    expect(newRecipe.body).toHaveProperty("description");
    expect(newRecipe.statusCode).toBe(200);

    // make sure we have 3 recipes left on table

    const response = await request(app).get("/recipe");
    expect(response.body.length).toBe(3);
    done();
  });
});

// Test update recipe route

describe("PUT /recipe/:id", () => {
  test("It should update recipes", async (done) => {
    const updatedRecipe = await request(app).put(`/recipe/1/recipe updated`);

    expect(updatedRecipe.body).toBe("recipe updated");
    expect(updatedRecipe.statusCode).toBe(200);

    // make sure we have 2 recipes left on table

    const response = await request(app).get("/recipe");
    expect(response.body.length).toBe(2);
    done();
  });
});

// Test delete recipe route

describe("DELETE /recipe/:id", () => {
  test("It should delete recipes", async (done) => {
    const newRecipe = await request(app).post("/recipe").send({
      description: "Broccoli is bad",
    });
    const removedRecipe = await request(app).delete(
      `/recipe/${newRecipe.body.recipe_id}`
    );
    expect(removedRecipe.body).toEqual("Recipe deleted");
    expect(removedRecipe.statusCode).toBe(200);

    // make sure we have 2 recipes left on table

    const response = await request(app).get("/recipe");
    expect(response.body.length).toBe(2);
    done();
  });
});
