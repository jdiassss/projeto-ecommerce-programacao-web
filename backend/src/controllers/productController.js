const productService = require('../services/productService');

class ProductController {
    // GET /api/produtos - Lista produtos com filtros
    async listProducts(req, res) {
        try {
            const filters = {
                categoria: req.query.categoria,
                busca: req.query.busca
            };

            const products = await productService.listProducts(filters);

            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar produtos',
                error: error.message
            });
        }
    }

    // GET /api/produtos/:id - Detalha um produto
    async getProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado'
                });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar produto',
                error: error.message
            });
        }
    }

    // POST /api/produtos/validar-estoque - Valida estoque antes de adicionar ao carrinho
    async validateStock(req, res) {
        try {
            const { productId, quantity } = req.body;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos'
                });
            }

            const stockCheck = await productService.checkStock(productId, quantity);

            res.json({
                success: stockCheck.available,
                available: stockCheck.available,
                stock: stockCheck.stock,
                message: stockCheck.message
            });
        } catch (error) {
            console.error('Erro ao validar estoque:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao validar estoque',
                error: error.message
            });
        }
    }

    // GET /api/categorias - Lista categorias
    async getCategories(req, res) {
        try {
            const categories = await productService.getCategories();

            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar categorias',
                error: error.message
            });
        }
    }
}

module.exports = new ProductController();