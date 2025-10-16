const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');

/**
 * Routes:
 * POST   /api/recipes      -> create recipe
 * GET    /api/recipes      -> get all recipes
 * GET    /api/recipes/:id  -> get one by id
 * PUT    /api/recipes/:id  -> update by id
 * DELETE /api/recipes/:id  -> delete by id
 */

router.post('/', controller.createRecipe);
router.get('/', controller.getAllRecipes);
router.get('/:id', controller.getRecipeById);
router.put('/:id', controller.updateRecipe);
router.delete('/:id', controller.deleteRecipe);

module.exports = router;
