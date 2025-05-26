const express = require('express');
const router = express.Router();
const peliculaController = require('../Controllers/PeliculaController.js');

router.get('/', peliculaController.obtenerPeliculas);
router.post('/', peliculaController.insertarPelicula);
router.delete('/:id', peliculaController.eliminarPelicula);

module.exports = router;