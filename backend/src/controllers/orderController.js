const orderService = require('../services/orderService');

class OrderController {
    // POST /api/pedidos - Criar um novo pedido
    async createOrder(req, res) {
        try {
            const { cliente, itens } = req.body;

            // Validações básicas
            if (!cliente || !cliente.nome || !cliente.email) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados do cliente inválidos'
                });
            }

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Carrinho vazio'
                });
            }
            // Validar formato dos itens
            for (const item of itens) {
                if (!item.productId || !item.quantity || item.quantity <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Formato de item inválido no carrinho'
                    });
                }
            }
            console.log(14)
            const order = await orderService.createOrder(cliente, itens);
            console.log(15)
            res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso',
                data: order
            });

        } catch (error) {
            console.error('Erro ao criar pedido:', error);

            // Se for erro de estoque, retorna 400
            if (error.message.includes('Estoque insuficiente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao criar pedido',
                error: error.message
            });
        }
    }

    // GET /api/pedidos?email=cliente@example.com - Lista pedidos de um cliente
    async getOrders(req, res) {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email é obrigatório'
                });
            }

            const orders = await orderService.getOrdersByEmail(email);

            res.json({
                success: true,
                count: orders.length,
                data: orders
            });

        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar pedidos',
                error: error.message
            });
        }
    }
}

module.exports = new OrderController();