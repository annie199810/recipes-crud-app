const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON bodies
app.use(morgan('dev'));  // logs requests in terminal

app.get('/', (req, res) => res.json({ success: true, message: 'Recipes API running' }));

app.use('/api/recipes', recipeRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

module.exports = app;
