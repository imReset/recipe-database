require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Recipe Database - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Recipe Database - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Recipe Database - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Recipe Database - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Reicpe Database - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Recipe Database - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Recipe Database - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Recipe Database - Add Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.contact = async (req, res) => {
  try {
    res.render("contact", { title: "Recipe Database - Contact" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      calories: req.body.calories,
      protein: req.body.protein,
      ingredients: req.body.ingredients,
      video: req.body.video,
      category: req.body.category,
      image: req.body.image,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect("/explore-latest");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.editRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("edit-recipe", { recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { name, description, calories, protein, ingredients, video } =
      req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { name, description, calories, protein, ingredients, video },
      { new: true }
    );
    res.redirect(`/recipe/${recipeId}`);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitEditRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("edit-recipe", {
    title: "Recipe Database - Edit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};
