const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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
  recipe: String,
  ingredients: String,
  steps: String,
  video: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.post("/", function (req, res) {
  let newRecipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    calories: req.body.calories,
    carbs: req.body.carbs,
    protein: req.body.protein,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    video: req.body.video,
  });
  newRecipe.save();
  res.redirect("/success");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
