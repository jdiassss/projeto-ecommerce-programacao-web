const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Criar pedido
router.post('/', orderController.createOrder);

// Listar pedidos por email
router.get('/', orderController.getOrders);

module.exports = router;