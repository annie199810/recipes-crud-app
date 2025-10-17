const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    return res.status(201).json({
      success: true,
      message: 'Recipe created successfully!',
      data: recipe
    });
  } catch (error) {
   
    return next(error);
  }
};


exports.getAllRecipes = async (req, res, next) => {
  try {
  
    console.log('🟢 DEBUG: getAllRecipes called');
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    console.log('🟢 DEBUG: found', recipes.length, 'recipes');
    return res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('🔴 DEBUG: getAllRecipes error:', error);
    return next(error);
  }
};


exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found!' });
    }
    return res.status(200).json({ success: true, data: recipe });
  } catch (error) {
   
    return next(error);
  }
};


exports.updateRecipe = async (req, res, next) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found!' });
    }
    return res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updatedRecipe
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found!' });
    }
    return res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully!'
    });
  } catch (error) {
    return next(error);
  }
};


exports.searchRecipes = async (req, res, next) => {
  try {
    let { q, tag, minServ, page = 1, limit = 10 } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filter = {};
    if (tag) filter.tags = tag;
    if (minServ) {
      const n = parseInt(minServ);
      if (!isNaN(n)) filter.servings = { $gte: n };
    }
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      data: recipes
    });
  } catch (err) {
    return next(err);
  }
};
