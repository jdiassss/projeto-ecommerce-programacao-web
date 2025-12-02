import * as productModule from '../modules/product.js';
import * as cart from '../modules/cart.js';
import * as ui from '../utils/ui.js';

(() => {
    'use strict';

    let allProducts = [];
    let currentCategory = 'all';
    let searchTerm = '';

    const productList = document.querySelector('#product-list');
    const categoryFilters = document.querySelector('#category-filters');
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');

    // Carrega produtos
    const loadProducts = async () => {
        try {
            console.log('WTFF')
            ui.updateStatus('Carregando produtos...', 'info');
            allProducts = await productModule.getProducts();

            if (allProducts.length === 0) {
                ui.updateStatus('Nenhum produto disponível', 'warning');
                productList.innerHTML = ui.cardProductEmpty();
                return;
            }

            ui.updateStatus('', 'none');
            renderProducts();
        } catch (error) {
            ui.updateStatus('Erro ao carregar produtos. Tente novamente.', 'danger');
            console.error('Erro ao carregar produtos:', error);
        }
    };

    // Carrega categorias
    const loadCategories = async () => {
        try {
            const categories = await productModule.getCategories();
            renderCategories(categories);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    // Renderiza categorias
    const renderCategories = (categories) => {
        categoryFilters.innerHTML = `
            <button type="button" class="list-group-item list-group-item-action active" data-category="all">
                Todas as Categorias
            </button>
        `;

        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'list-group-item list-group-item-action';
            btn.dataset.category = category;
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilters.appendChild(btn);
        });

        categoryFilters.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', handleCategoryClick);
        });
    };

    // Manipula clique em categoria
    const handleCategoryClick = (e) => {
        const btn = e.target;
        currentCategory = btn.dataset.category;

        categoryFilters.querySelectorAll('button').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        renderProducts();
    };

    // Manipula busca
    const handleSearch = () => {
        searchTerm = searchInput.value.toLowerCase().trim();
        renderProducts();
    };

    // Filtra produtos
    const filterProducts = () => {
        let filtered = allProducts;

        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.categoria === currentCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.titulo.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    };

    // Renderiza produtos
    const renderProducts = () => {
        const filtered = filterProducts();

        if (filtered.length === 0) {
            productList.innerHTML = ui.cardProductEmpty();
            return;
        }

        productList.innerHTML = '';
        filtered.forEach(product => {
            const col = ui.cardProduct(product);
            productList.appendChild(col);
        });

        // Adiciona evento aos botões de detalhes
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    };

    // Atualiza badge do carrinho
    const updateCartBadge = () => {
        const count = cart.getItemCount();
        ui.updateCartBadge(count);
    };

    // Event listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    window.addEventListener('cartUpdated', updateCartBadge);

    // Inicialização
    updateCartBadge();
    loadProducts();
    loadCategories();
})();