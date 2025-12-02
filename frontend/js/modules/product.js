import { API } from '../config.js';

// Busca todos os produtos com filtros opcionais
const getProducts = async (filters = {}) => {
    try {
        let url = API.produtos;
        console.log(API.produtos);
        console.log(API)
        const params = new URLSearchParams();
        
        if (filters.categoria) {
            params.append('categoria', filters.categoria);
        }
        if (filters.busca) {
            params.append('busca', filters.busca);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

// Busca um produto por ID
const getProductById = async (id) => {
    try {
        const response = await fetch(API.produtoDetalhe(id));
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
};

// Busca categorias
const getCategories = async () => {
    try {
        const response = await fetch(API.categorias);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
    }
};

// Valida estoque antes de adicionar ao carrinho
const validateStock = async (productId, quantity) => {
    try {
        const response = await fetch(API.validarEstoque, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao validar estoque:', error);
        throw error;
    }
};

export { getProducts, getProductById, getCategories, validateStock };