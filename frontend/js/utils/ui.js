// Atualiza mensagem de status
const updateStatus = (text, type = 'info') => {
    const statusMessage = document.querySelector('#status-message');
    if (!statusMessage) return;
    
    if (type === 'none') {
        statusMessage.classList.add('d-none');
    } else {
        statusMessage.textContent = text;
        statusMessage.className = `alert alert-${type} text-center`;
        statusMessage.classList.remove('d-none');
    }
};

// Cria card de produto vazio
const cardProductEmpty = () => {
    return `<div class="col-12">
        <div class="alert alert-warning text-center">
            Nenhum produto encontrado com os filtros atuais.
        </div>
    </div>`;
};

// Cria card de produto
const cardProduct = (product) => {
    const col = document.createElement('div');
    col.classList.add('col');
        console.log("PRODUCT RECEBIDO:", product);
        console.log("TYPE OF preco:", typeof product.preco, product.preco);
    
    // Converte preço e estoque para número (podem vir como string do MySQL)
    const preco = parseFloat(product.preco) || 0;
    const estoque = parseInt(product.estoque) || 0;

    const stockBadge = estoque > 0 
        ? `<span class="badge bg-success">Em estoque: ${estoque}</span>`
        : `<span class="badge bg-danger">Sem estoque</span>`;
    
    col.innerHTML = `
        <div class="card shadow-sm h-100">
            <img src="${product.imagem_url}" class="card-img-top product-image" alt="${product.titulo}">
            
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.titulo}</h5>
                <p class="text-muted small mb-2">${product.categoria}</p>
                ${stockBadge}
                <p class="card-text fw-bold text-success fs-5 mt-2">R$ ${preco.toFixed(2)}</p>
                
                <div class="mt-auto">
                    <button 
                        class="btn btn-primary w-100 btn-view-details" 
                        data-product-id="${product.id}">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
};

// Formata data
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formata moeda
const formatCurrency = (value) => {
    const valorNumerico = parseFloat(value) || 0;
    return `R$ ${valorNumerico.toFixed(2)}`;
};

// Mostra toast de notificação
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

// Cria container de toasts se não existir
const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
};

// Atualiza contador do carrinho no header
const updateCartBadge = (count) => {
    const badge = document.querySelector('#cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
};

export { 
    updateStatus, 
    cardProductEmpty, 
    cardProduct, 
    formatDate, 
    formatCurrency,
    showToast,
    updateCartBadge
};