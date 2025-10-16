const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  ingredients: { type: [String], default: [] },
  steps: { type: [String], default: [] },
  prepTimeMins: { type: Number, default: 0 },
  cookTimeMins: { type: Number, default: 0 },
  servings: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// automatically update updatedAt when saving
recipeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);
