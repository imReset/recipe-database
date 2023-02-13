const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  calories: Number,
  carbs: Number,
  protein: Number,
  ingredients: [String],
  steps: [String],
  video: String,
  slug: {
    type: String,
    unique: true,
  },
});

recipeSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Recipe", recipeSchema);
