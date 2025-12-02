import * as orderModule from '../modules/order.js';
import * as cart from '../modules/cart.js';
import * as ui from '../utils/ui.js';

(() => {
    'use strict';

    const emailInput = document.querySelector('#email-input');
    const searchBtn = document.querySelector('#search-orders-btn');
    const ordersContainer = document.querySelector('#orders-container');
    const noOrders = document.querySelector('#no-orders');
    const loading = document.querySelector('#loading');

    // Busca pedidos
    const searchOrders = async () => {
        const email = emailInput.value.trim();

        if (!email) {
            ui.showToast('Digite um e-mail válido', 'warning');
            return;
        }

        try {
            ordersContainer.innerHTML = '';
            noOrders.style.display = 'none';
            loading.style.display = 'block';

            const orders = await orderModule.getOrdersByEmail(email);

            loading.style.display = 'none';

            if (orders.length === 0) {
                noOrders.style.display = 'block';
                return;
            }

            renderOrders(orders);

        } catch (error) {
            loading.style.display = 'none';
            console.error('Erro ao buscar pedidos:', error);
            ui.showToast('Erro ao buscar pedidos. Tente novamente.', 'danger');
        }
    };

    // Renderiza pedidos
    const renderOrders = (orders) => {
        ordersContainer.innerHTML = '';

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'col-12 mb-4';

            const itemsHtml = order.itens.map(item => `
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div class="d-flex align-items-center">
                        <img src="${item.produto_imagem}" style="width: 60px; height: 60px; object-fit: contain;" class="me-3">
                        <div>
                            <h6 class="mb-0">${item.produto_titulo}</h6>
                            <small class="text-muted">Quantidade: ${item.quantidade} × R$ ${parseFloat(item.preco_unitario).toFixed(2)}</small>
                        </div>
                    </div>
                    <strong class="text-success">R$ ${parseFloat(item.subtotal).toFixed(2)}</strong>
                </div>
            `).join('');

            orderCard.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-0"><i class="fas fa-receipt"></i> Pedido #${order.pedido_id}</h5>
                            <small>${ui.formatDate(order.data)}</small>
                        </div>
                        <div class="text-end">
                            <h4 class="mb-0">${ui.formatCurrency(order.valor_total)}</h4>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="mb-3">Itens do Pedido:</h6>
                        ${itemsHtml}
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                            <strong>Total do Pedido:</strong>
                            <strong class="text-success fs-5">${ui.formatCurrency(order.valor_total)}</strong>
                        </div>
                    </div>
                </div>
            `;

            ordersContainer.appendChild(orderCard);
        });
    };

    // Atualiza badge do carrinho
    const updateCartBadge = () => {
        const count = cart.getItemCount();
        ui.updateCartBadge(count);
    };

    // Event listeners
    searchBtn.addEventListener('click', searchOrders);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchOrders();
    });

    // Inicialização
    updateCartBadge();

    // Se houver email na URL (vindo do checkout), busca automaticamente
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
        emailInput.value = emailParam;
        searchOrders();
    }
})();