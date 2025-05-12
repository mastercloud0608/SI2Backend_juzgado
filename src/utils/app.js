// src/utils/app.js
const express = require('express');
const cors    = require('cors');

const apiRouter = require('../routes');  // <— el router central

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send('¡API funcionando correctamente!'));

// Monta **todo** tu API bajo `/api`
app.use('/api', apiRouter);

module.exports = app;
