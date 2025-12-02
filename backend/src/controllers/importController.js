const fetch = require('node-fetch');
const productService = require('../services/productService');

class ImportController {
    // POST /api/import/fakestore - Importa produtos da FakeStore API
    async importFromFakeStore(req, res) {
        try {
            console.log('Iniciando importação da FakeStore API...');

            // Buscar produtos da FakeStore API
            const response = await fetch('https://fakestoreapi.com/products');
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados da FakeStore API: ${response.status}`);
            }

            const products = await response.json();

            // Adicionar estoque padrão aos produtos
            const productsWithStock = products.map(product => ({
                ...product,
                stock: Math.floor(Math.random() * 50) + 20 // Estoque entre 20 e 70
            }));

            // Importar para o banco
            const result = await productService.importFromFakeStore(productsWithStock);

            console.log(`✅ ${result.count} produtos importados com sucesso`);

            res.json({
                success: true,
                message: `${result.count} produtos importados com sucesso`,
                data: {
                    count: result.count
                }
            });

        } catch (error) {
            console.error('Erro ao importar produtos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao importar produtos',
                error: error.message
            });
        }
    }
}

module.exports = new ImportController();