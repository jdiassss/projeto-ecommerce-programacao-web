import * as cart from '../modules/cart.js';
import * as ui from '../utils/ui.js';

(() => {
    'use strict';

    const cartItemsContainer = document.querySelector('#cart-items');
    const cartEmpty = document.querySelector('#cart-empty');
    const cartContent = document.querySelector('#cart-content');
    const checkoutBtn = document.querySelector('#checkout-btn');

    // Renderiza o carrinho
    const renderCart = () => {

        const cartData = cart.load();

        if (cartData.items.length === 0) {
            cartEmpty.style.display = 'block';
            cartContent.style.display = 'none';
            return;
        }

        cartEmpty.style.display = 'none';
        cartContent.style.display = 'flex';

cartItemsContainer.innerHTML = '';

cartData.items.forEach(item => {

    const precoUnit = Number(item.preco?.toString().replace(',', '.')) || 0;
    const totalItem = precoUnit * item.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item border-bottom pb-3 mb-3';
    
    itemDiv.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <img src="${item.imagem_url}" class="img-fluid" alt="${item.titulo}">
            </div>
            <div class="col-md-4">
                <h6>${item.titulo}</h6>
                <p class="text-muted small mb-0">${ui.formatCurrency(item.preco)} / unidade</p>
            </div>
            <div class="col-md-3">
                <div class="input-group input-group-sm">
                    <button class="btn btn-outline-secondary btn-decrease" data-id="${item.id}" type="button">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="form-control text-center quantity-input" value="${item.quantity}" min="1" max="${item.estoque}" data-id="${item.id}" readonly>
                    <button class="btn btn-outline-secondary btn-increase" data-id="${item.id}" data-max="${item.estoque}" type="button">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <small class="text-muted">Estoque: ${item.estoque}</small>
            </div>
            <div class="col-md-2 text-end">
                <strong class="text-success">R$ ${totalItem.toFixed(2)}</strong>
            </div>
            <div class="col-md-1 text-end">
                <button class="btn btn-sm btn-danger btn-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    cartItemsContainer.appendChild(itemDiv);
});
        // Event listeners para botões
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const max = parseInt(btn.dataset.max);
                const item = cartData.items.find(i => i.id === id);
                
                if (item && item.quantity < max) {
                    cart.updateQuantity(id, item.quantity + 1);
                    renderCart();
                    ui.showToast('Quantidade atualizada', 'success');
                } else {
                    ui.showToast('Estoque máximo atingido', 'warning');
                }
            });
        });

        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = cartData.items.find(i => i.id === id);
                
                if (item && item.quantity > 1) {
                    cart.updateQuantity(id, item.quantity - 1);
                    renderCart();
                    ui.showToast('Quantidade atualizada', 'success');
                }
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                cart.removeItem(id);
                renderCart();
                ui.showToast('Item removido do carrinho', 'info');
            });
        });

        updateTotals();
        updateCartBadge();
    };

    // Atualiza totais
    const updateTotals = () => {
        const total = cart.getTotal();
        document.querySelector('#cart-subtotal').textContent = ui.formatCurrency(total);
        document.querySelector('#cart-total').textContent = ui.formatCurrency(total);
    };

    // Atualiza badge do carrinho
    const updateCartBadge = () => {
        const count = cart.getItemCount();
        ui.updateCartBadge(count);
    };

    // Event listeners
    window.addEventListener('cartUpdated', renderCart);

    // Inicialização
    renderCart();
    updateCartBadge();
})();