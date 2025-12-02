import * as cart from '../modules/cart.js';
import * as orderModule from '../modules/order.js';
import * as ui from '../utils/ui.js';

(() => {
    'use strict';

    const orderSummary = document.querySelector('#order-summary');
    const orderTotal = document.querySelector('#order-total');
    const finalizeBtn = document.querySelector('#finalize-order-btn');
    const checkoutForm = document.querySelector('#checkout-form');
    const clientName = document.querySelector('#client-name');
    const clientEmail = document.querySelector('#client-email');

    // Renderiza resumo do pedido
    const renderOrderSummary = () => {
        const cartData = cart.load();

        if (cartData.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        orderSummary.innerHTML = '';

        cartData.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'd-flex justify-content-between align-items-center mb-2';
            itemDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imagem_url}" style="width: 50px; height: 50px; object-fit: contain;" class="me-2">
                    <div>
                        <small class="d-block">${item.titulo}</small>
                        <small class="text-muted">Qtd: ${item.quantity}</small>
                    </div>
                </div>
                <span class="text-success">R$ ${(item.preco * item.quantity).toFixed(2)}</span>
            `;
            orderSummary.appendChild(itemDiv);
        });

        const total = cart.getTotal();
        orderTotal.textContent = ui.formatCurrency(total);
    };

    // Finaliza pedido
    const finalizeOrder = async () => {
        // Validação do formulário
        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        const cartData = cart.load();

        if (cartData.items.length === 0) {
            ui.showToast('Carrinho vazio', 'warning');
            window.location.href = 'cart.html';
            return;
        }

        const clientData = {
            nome: clientName.value.trim(),
            email: clientEmail.value.trim()
        };

        try {
            finalizeBtn.disabled = true;
            finalizeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';

            const result = await orderModule.createOrder(clientData, cartData.items);

            if (result.success) {
                // Limpa o carrinho
                cart.clear();

                // Mostra modal de sucesso
                document.querySelector('#order-number').textContent = `#${result.data.pedidoId}`;
                const successModal = new bootstrap.Modal(document.querySelector('#success-modal'));
                successModal.show();
            }

        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            ui.showToast(error.message || 'Erro ao processar pedido. Tente novamente.', 'danger');
            
            finalizeBtn.disabled = false;
            finalizeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Pedido';
        }
    };

    // Event listeners
    finalizeBtn.addEventListener('click', finalizeOrder);

    // Inicialização
    renderOrderSummary();
})();