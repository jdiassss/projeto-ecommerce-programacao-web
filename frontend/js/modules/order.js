import { API } from '../config.js';

// Cria um novo pedido
const createOrder = async (clientData, cartItems) => {
    try {
        const itens = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const response = await fetch(API.criarPedido, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cliente: clientData,
                itens: itens
            })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro ao criar pedido');
        }

        return result;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
};

// Busca pedidos de um cliente por email
const getOrdersByEmail = async (email) => {
    try {
        const response = await fetch(API.meusPedidos(email));
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
};

export { createOrder, getOrdersByEmail };