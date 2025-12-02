const db = require('../config/database');

class ProductService {
    // Lista produtos com filtros opcionais
    async listProducts(filters = {}) {
        let query = 'SELECT id, titulo, preco, categoria, imagem_url, estoque FROM produtos WHERE 1=1';
        const params = [];

        if (filters.categoria) {
            query += ' AND categoria = ?';
            params.push(filters.categoria);
        }

        if (filters.busca) {
            query += ' AND (titulo LIKE ? OR descricao LIKE ?)';
            params.push(`%${filters.busca}%`, `%${filters.busca}%`);
        }

        query += ' ORDER BY id';

        const [rows] = await db.query(query, params);
        return rows;
    }

    // Busca produto por ID
    async getProductById(id) {
        const [rows] = await db.query(
            'SELECT * FROM produtos WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    // Verifica estoque disponível
    async checkStock(productId, quantity) {
        const [rows] = await db.query(
            'SELECT estoque FROM produtos WHERE id = ?',
            [productId]
        );

        if (rows.length === 0) {
            return { available: false, message: 'Produto não encontrado' };
        }

        const availableStock = rows[0].estoque;
        
        if (availableStock >= quantity) {
            return { available: true, stock: availableStock };
        }

        return { 
            available: false, 
            stock: availableStock,
            message: `Estoque insuficiente. Disponível: ${availableStock}` 
        };
    }

    // Atualiza estoque (usado ao finalizar pedido)
    async updateStock(productId, quantity) {

        const [result] = await db.query(
            'UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?',
            [quantity, productId, quantity]
        );

        return result.affectedRows > 0;
    }

    // Atualiza estoque (usado ao finalizar pedido)
    async updateStock(productId, quantity, connection = null) {
        const dbToUse = connection || db;
        
        const [result] = await dbToUse.query(
            'UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?',
            [quantity, productId, quantity]
        );
    
        return result.affectedRows > 0;
    }

    // Importa produtos da FakeStore API
    async importFromFakeStore(products) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            for (const product of products) {
                await connection.query(
                    `INSERT INTO produtos (titulo, descricao, preco, categoria, imagem_url, estoque, fakestore_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     titulo = VALUES(titulo),
                     descricao = VALUES(descricao),
                     preco = VALUES(preco),
                     categoria = VALUES(categoria),
                     imagem_url = VALUES(imagem_url)`,
                    [
                        product.title,
                        product.description,
                        product.price,
                        product.category,
                        product.image,
                        product.stock || 50, // Estoque inicial padrão
                        product.id
                    ]
                );
            }

            await connection.commit();
            return { success: true, count: products.length };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Lista categorias únicas
    async getCategories() {
        const [rows] = await db.query(
            'SELECT DISTINCT categoria FROM produtos ORDER BY categoria'
        );
        return rows.map(row => row.categoria);
    }
}

module.exports = new ProductService();