const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Thiis is a required field'
  },
  description: {
    type: String,
    required: 'Thiis is a required field'
  },
  calories: {
    type: Number,
    required: 'Thiis is a required field'
  },
  protein: {
    type: Number,
    required: 'Thiis is a required field'
  },
  ingredients: {
    type: Array,
    required: 'Thiis is a required field'
  },
  category: {
    type: String,
    enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian'],
    required: 'Thiis is a required field'
  },
  video: {
    type: String,
  },
  image: {
    type: String,
    required: 'Thiis is a required field'
  },
});

recipeSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);