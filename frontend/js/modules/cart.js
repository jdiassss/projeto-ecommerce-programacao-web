const CART_KEY = 'ecommerce-cart';

// Carrega o carrinho do localStorage
const load = () => {
    try {
        const data = localStorage.getItem(CART_KEY);
        if (!data) {
            return { items: [], updatedAt: Date.now() };
        }
        
        const cart = JSON.parse(data);
        if (!cart || !Array.isArray(cart.items)) {
            return { items: [], updatedAt: Date.now() };
        }
        
        return cart;
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        return { items: [], updatedAt: Date.now() };
    }
};

// Salva o carrinho no localStorage
const save = (cart) => {
    try {
        cart.updatedAt = Date.now();
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        dispatchCartEvent();
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
};

// Adiciona um item ao carrinho
const addItem = (product, quantity = 1) => {
    const cart = load();
    
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            id: product.id,
            titulo: product.titulo,
            preco: product.preco,
            imagem_url: product.imagem_url,
            quantity: quantity,
            estoque: product.estoque
        });
    }
    
    save(cart);
    return cart;
};

// Remove um item do carrinho
const removeItem = (productId) => {
    const cart = load();
    cart.items = cart.items.filter(item => item.id !== productId);
    save(cart);
    return cart;
};

// Atualiza a quantidade de um item
const updateQuantity = (productId, quantity) => {
    const cart = load();
    const item = cart.items.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            return removeItem(productId);
        }
        item.quantity = quantity;
        save(cart);
    }
    
    return cart;
};

// Limpa o carrinho
const clear = () => {
    const cart = { items: [], updatedAt: Date.now() };
    save(cart);
    return cart;
};

// Calcula o total do carrinho
const getTotal = () => {
    const cart = load();
    return cart.items.reduce((total, item) => {
        return total + (item.preco * item.quantity);
    }, 0);
};

// Retorna a quantidade de itens no carrinho
const getItemCount = () => {
    const cart = load();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
};

// Dispara evento customizado quando o carrinho é atualizado
const dispatchCartEvent = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart: load() } 
    }));
};

export { 
    load, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clear, 
    getTotal, 
    getItemCount 
};