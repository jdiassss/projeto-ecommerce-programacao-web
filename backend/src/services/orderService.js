const db = require('../config/database');
const productService = require('./productService');

class OrderService {
    // Cria um novo pedido
    async createOrder(clientData, items) {
        const connection = await db.getConnection();

        try {
                        console.log(1)

            await connection.beginTransaction();
                        console.log(2)
            // 1. Validar estoque de todos os itens
            for (const item of items) {
                const stockCheck = await productService.checkStock(item.productId, item.quantity);
                
                if (!stockCheck.available) {
                    throw new Error(stockCheck.message || `Estoque insuficiente para o produto ID ${item.productId}`);
                }
            }

            // 2. Criar ou buscar cliente
            let clientId;
            const [existingClient] = await connection.query(
                'SELECT id FROM clientes WHERE email = ?',
                [clientData.email]
            );
                        console.log(3)

            if (existingClient.length > 0) {
                clientId = existingClient[0].id;
                // Atualiza o nome se necessário
                await connection.query(
                    'UPDATE clientes SET nome = ? WHERE id = ?',
                    [clientData.nome, clientId]
                );
            } else {
                const [result] = await connection.query(
                    'INSERT INTO clientes (nome, email) VALUES (?, ?)',
                    [clientData.nome, clientData.email]
                );
                clientId = result.insertId;
            }
                        console.log(4)

            // 3. Calcular valor total
            let valorTotal = 0;
            const itemsWithPrices = [];

            for (const item of items) {
                const product = await productService.getProductById(item.productId);
                if (!product) {
                    throw new Error(`Produto ID ${item.productId} não encontrado`);
                }

                const subtotal = product.preco * item.quantity;
                valorTotal += subtotal;

                itemsWithPrices.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    preco_unitario: product.preco,
                    subtotal: subtotal
                });
            }
                        console.log(5)
            // 4. Criar pedido
            const [orderResult] = await connection.query(
                'INSERT INTO pedidos (cliente_id, valor_total) VALUES (?, ?)',
                [clientId, valorTotal]
            );

            const pedidoId = orderResult.insertId;

            // 5. Criar itens do pedido e atualizar estoque
for (const item of itemsWithPrices) {
    await connection.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, item.productId, item.quantity, item.preco_unitario, item.subtotal]
    );
    console.log(777)

    // Atualizar estoque - ADICIONE connection AQUI ⬇️
    const updated = await productService.updateStock(item.productId, item.quantity, connection);
    if (!updated) {
        throw new Error(`Falha ao atualizar estoque do produto ID ${item.productId}`);
    }
}

            await connection.commit();
                                    console.log(6)

            return {
                pedidoId,
                valorTotal,
                clienteNome: clientData.nome,
                clienteEmail: clientData.email
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Lista pedidos de um cliente por email
    async getOrdersByEmail(email) {
        const query = `
            SELECT 
                p.id as pedido_id,
                p.valor_total,
                p.criado_em as data,
                c.nome as cliente_nome,
                c.email as cliente_email
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.email = ?
            ORDER BY p.criado_em DESC
        `;

        const [orders] = await db.query(query, [email]);

        // Buscar itens de cada pedido
        for (const order of orders) {
            const itemsQuery = `
                SELECT 
                    ip.quantidade,
                    ip.preco_unitario,
                    ip.subtotal,
                    pr.titulo as produto_titulo,
                    pr.imagem_url as produto_imagem
                FROM itens_pedido ip
                JOIN produtos pr ON ip.produto_id = pr.id
                WHERE ip.pedido_id = ?
            `;

            const [items] = await db.query(itemsQuery, [order.pedido_id]);
            order.itens = items;
        }

        return orders;
    }
}

module.exports = new OrderService();