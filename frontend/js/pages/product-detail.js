import * as productModule from '../modules/product.js';
import * as cart from '../modules/cart.js';
import * as ui from '../utils/ui.js';

(() => {
    'use strict';

    let currentProduct = null;
    let maxStock = 0;

    const loading = document.querySelector('#loading');
    const productDetail = document.querySelector('#product-detail');
    const productError = document.querySelector('#product-error');
    
    const productImage = document.querySelector('#product-image');
    const productTitle = document.querySelector('#product-title');
    const productCategory = document.querySelector('#product-category');
    const productStock = document.querySelector('#product-stock');
    const productDescription = document.querySelector('#product-description');
    const productPrice = document.querySelector('#product-price');
    
    const quantityInput = document.querySelector('#quantity');
    const decreaseBtn = document.querySelector('#decrease-qty');
    const increaseBtn = document.querySelector('#increase-qty');
    const addToCartBtn = document.querySelector('#add-to-cart-btn');

    // Obtém ID do produto da URL
    const getProductId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    // Carrega detalhes do produto
    const loadProductDetails = async () => {
        const productId = getProductId();

        if (!productId) {
            showError();
            return;
        }

        try {
            loading.style.display = 'block';
            productDetail.style.display = 'none';
            productError.style.display = 'none';

            currentProduct = await productModule.getProductById(productId);

            if (!currentProduct) {
                showError();
                return;
            }

            renderProduct();
            console.log('LINHA 57')


        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            showError();
        }
    };

    // Renderiza o produto
    const renderProduct = () => {
        console.log('LINHA 66')

        loading.style.display = 'none';
        productDetail.style.display = 'flex';
        console.log('LINHA 70')
        productImage.src = currentProduct.imagem_url;
        productImage.alt = currentProduct.titulo;
        productTitle.textContent = currentProduct.titulo;
        productCategory.textContent = currentProduct.categoria.charAt(0).toUpperCase() + currentProduct.categoria.slice(1);
        productDescription.textContent = currentProduct.descricao;
        const preco = Number(currentProduct.preco?.toString().replace(',', '.')) || 0;
        productPrice.textContent = `R$ ${preco.toFixed(2)}`;
        console.log('LINHA 77')
        maxStock = currentProduct.estoque;

        if (maxStock > 0) {
            productStock.textContent = `Em estoque: ${maxStock} unidades`;
            productStock.className = 'badge bg-success fs-6';
            addToCartBtn.disabled = false;
        } else {
            productStock.textContent = 'Sem estoque';
            productStock.className = 'badge bg-danger fs-6';
            addToCartBtn.disabled = true;
        }

        quantityInput.max = maxStock;
    };

    // Mostra erro
    const showError = () => {
        loading.style.display = 'none';
        productDetail.style.display = 'none';
        productError.style.display = 'block';
    };

    // Diminui quantidade
    const decreaseQuantity = () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    };

    // Aumenta quantidade
    const increaseQuantity = () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < maxStock) {
            quantityInput.value = currentValue + 1;
        } else {
            ui.showToast('Quantidade máxima disponível', 'warning');
        }
    };

    // Adiciona ao carrinho
    const addToCart = async () => {
        const quantity = parseInt(quantityInput.value);

        if (quantity <= 0 || quantity > maxStock) {
            ui.showToast('Quantidade inválida', 'warning');
            return;
        }

        try {
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validando...';

            // Valida estoque no backend
            const validation = await productModule.validateStock(currentProduct.id, quantity);

            if (!validation.available) {
                ui.showToast(validation.message || 'Estoque insuficiente', 'danger');
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
                return;
            }

            // Adiciona ao carrinho
            cart.addItem(currentProduct, quantity);
            
            ui.showToast(`${quantity} ${quantity > 1 ? 'itens adicionados' : 'item adicionado'} ao carrinho!`, 'success');
            
            // Reseta quantidade
            quantityInput.value = 1;

            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';

        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            ui.showToast('Erro ao adicionar ao carrinho. Tente novamente.', 'danger');
            
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
        }
    };

    // Atualiza badge do carrinho
    const updateCartBadge = () => {
        const count = cart.getItemCount();
        ui.updateCartBadge(count);
    };

    // Event listeners
    decreaseBtn.addEventListener('click', decreaseQuantity);
    increaseBtn.addEventListener('click', increaseQuantity);
    addToCartBtn.addEventListener('click', addToCart);
    window.addEventListener('cartUpdated', updateCartBadge);

    // Inicialização
    updateCartBadge();
    loadProductDetails();
})();