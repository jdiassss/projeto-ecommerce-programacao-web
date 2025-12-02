const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Listar produtos (com filtros opcionais)
router.get('/', productController.listProducts);

// Buscar categorias
router.get('/categorias', productController.getCategories);

// Validar estoque
router.post('/validar-estoque', productController.validateStock);

// Detalhar produto por ID
router.get('/:id', productController.getProduct);

module.exports = router;