const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');



router.post('/', controller.createRecipe);
router.get('/', controller.getAllRecipes);
router.get('/:id', controller.getRecipeById);
router.put('/:id', controller.updateRecipe);
router.delete('/:id', controller.deleteRecipe);

module.exports = router;
