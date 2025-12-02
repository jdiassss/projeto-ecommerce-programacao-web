// Configuração da URL da API
const API_BASE_URL = 'http://localhost:3000/api';

const API = {
    // Produtos
    produtos: `${API_BASE_URL}/produtos`,
    produtoDetalhe: (id) => `${API_BASE_URL}/produtos/${id}`,
    categorias: `${API_BASE_URL}/produtos/categorias`,
    validarEstoque: `${API_BASE_URL}/produtos/validar-estoque`,
    
    // Pedidos
    criarPedido: `${API_BASE_URL}/pedidos`,
    meusPedidos: (email) => `${API_BASE_URL}/pedidos?email=${encodeURIComponent(email)}`,
    
    // Importação
    importarProdutos: `${API_BASE_URL}/import/fakestore`
};

export { API, API_BASE_URL };