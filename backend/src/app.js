const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Rotas
app.get('/', (req, res) => {
    res.json({
        message: 'API E-commerce - Backend funcionando!',
        endpoints: {
            produtos: '/api/produtos',
            categorias: '/api/produtos/categorias',
            validarEstoque: 'POST /api/produtos/validar-estoque',
            criarPedido: 'POST /api/pedidos',
            meusPedidos: 'GET /api/pedidos?email=cliente@example.com',
            importar: 'POST /api/import/fakestore'
        }
    });
});

app.use('/api/produtos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/import', importRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: err.message
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}`);
    console.log(`\n📝 Endpoints disponíveis:`);
    console.log(`   GET  /api/produtos - Lista produtos`);
    console.log(`   GET  /api/produtos/:id - Detalha produto`);
    console.log(`   GET  /api/produtos/categorias - Lista categorias`);
    console.log(`   POST /api/produtos/validar-estoque - Valida estoque`);
    console.log(`   POST /api/pedidos - Criar pedido`);
    console.log(`   GET  /api/pedidos?email=... - Listar pedidos`);
    console.log(`   POST /api/import/fakestore - Importar produtos\n`);
});

module.exports = app;