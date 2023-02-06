const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://imreset:Jkcs1439@cluster0.htctb.mongodb.net/recipeDB",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
); //! Add env later

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  calories: Number,
  carbs: Number,
  protein: Number,
  ingredients: String,
  steps: String,
  video: String,
  slug: {
    type: String,
    unique: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/new", function (req, res) {
  res.sendFile(__dirname + "/recipe.html");
});

app.post("/new", function (req, res) {
  let newRecipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    calories: req.body.calories,
    carbs: req.body.carbs,
    protein: req.body.protein,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    video: req.body.video,
    slug: req.body.title.toLowerCase().split(" ").join("-"),
  });
  newRecipe.save();
  res.redirect("/recipes");
});

app.get("/recipes", (req, res) => {
  Recipe.find({}, function (err, recipes) {
    res.render("recipes", {
      recipeList: recipes,
    });
  });
});

app.get("/recipes/:slug", (req, res) => {
  Recipe.findOne({ slug: req.params.slug }, function (err, recipe) {
    res.render("recipe", {
      recipe: recipe,
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
