const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));  

app.get('/', (req, res) => res.json({ success: true, message: 'Recipes API running' }));

app.use('/api/recipes', recipeRoutes);


app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

module.exports = app;
