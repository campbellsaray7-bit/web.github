   // Formato de precios en pesos colombianos
    const formatCOP = amount => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(amount);

    // Estado del carrito
    const cart = new Map();

    const cartToggle = document.getElementById('cartToggle');
    const cartDropdown = document.getElementById('cartDropdown');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function openCart() {
        cartDropdown.hidden = false;
        cartToggle.setAttribute('aria-expanded', 'true');
    }

    function hideCart() {
        cartDropdown.hidden = true;
        cartToggle.setAttribute('aria-expanded', 'false');
    }

    cartToggle.addEventListener('click', () => {
        if (cartDropdown.hidden) {
            openCart();
        } else {
            hideCart();
        }
    });

    closeCart.addEventListener('click', hideCart);
    continueShopping.addEventListener('click', hideCart);

    // Cerrar al pulsar fuera del carrito
    document.addEventListener('click', event => {
        if (
            !cartDropdown.hidden &&
            !cartDropdown.contains(event.target) &&
            !cartToggle.contains(event.target)
        ) {
            hideCart();
        }
    });

    // Añadir productos
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const existing = cart.get(id);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.set(id, {
                    id,
                    name: button.dataset.name,
                    price: Number(button.dataset.price),
                    image: button.dataset.image,
                    quantity: 1
                });
            }

            renderCart();
            openCart();
        });
    });

    function changeQuantity(id, change) {
        const item = cart.get(id);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart.delete(id);
        }

        renderCart();
    }

    function removeItem(id) {
        cart.delete(id);
        renderCart();
    }

    // Dibujar productos, cantidades y totales
    function renderCart() {
        const items = Array.from(cart.values());

        const quantity = items.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        cartCount.textContent = quantity;
        cartSubtotal.textContent = formatCOP(subtotal);
        cartTotal.textContent = formatCOP(subtotal);

        if (items.length === 0) {
            cartItems.innerHTML = `
                <p class="cart-empty">
                    <span class="empty-icon">🛍️</span>
                    Tu carrito está vacío.<br>
                    ¡Encuentra tu termo ideal!
                </p>
            `;
            return;
        }

        cartItems.innerHTML = items.map(item => `
            <article class="cart-item">
                <img src="${item.image}" alt="">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">${formatCOP(item.price)}</div>

                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button type="button"
                                data-action="decrease"
                                data-id="${item.id}"
                                aria-label="Disminuir cantidad">−</button>

                            <span>${item.quantity}</span>

                            <button type="button"
                                data-action="increase"
                                data-id="${item.id}"
                                aria-label="Aumentar cantidad">+</button>
                        </div>

                        <button type="button"
                            class="remove-item"
                            data-action="remove"
                            data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            </article>
        `).join('');
    }

    // Eventos de cantidad y eliminación
    cartItems.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'increase') changeQuantity(id, 1);
        if (action === 'decrease') changeQuantity(id, -1);
        if (action === 'remove') removeItem(id);
    });

    // Controles del carrusel
  // CONTROLES DEL CARRUSEL

const productsCarousel = document.getElementById('productsCarousel');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

function moveCarousel(direction) {

    const card = productsCarousel.querySelector('.product-card');

    if (!card) return;

    const cardWidth = card.offsetWidth + 22;

    productsCarousel.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });

}

carouselPrev.addEventListener('click', () => {
    moveCarousel(-1);
});

carouselNext.addEventListener('click', () => {
    moveCarousel(1);
});

    // Filtros de marca
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts(brand) {
        productsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        productCards.forEach(card => {
            card.hidden = brand !== 'todos' &&
                          card.dataset.brand !== brand;
        });

        filterButtons.forEach(button => {
            const active = button.dataset.filter === brand;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterProducts(button.dataset.filter);
        });
    });

    document.querySelectorAll('[data-brand-link]').forEach(link => {
        link.addEventListener('click', () => {
            filterProducts(link.dataset.brandLink);
        });
    });

    // Demo: no hay una pasarela de pagos conectada
    checkoutBtn.addEventListener('click', () => {
        if (cart.size === 0) {
            alert('Tu carrito está vacío. Añade un producto primero.');
            return;
        }

        alert(
            'Tu carrito tiene ' + cartCount.textContent +
            ' producto(s), por un subtotal de ' +
            cartSubtotal.textContent +
            '. Esta es una demostración: todavía debes conectar un sistema de pedidos y pagos.'
        );
    });

    // Vista de detalle: se abre al pulsar "Ver detalles" o la imagen/nombre.
    const detailView = document.getElementById('productDetailView');
    const detailBack = document.getElementById('detailBack');
    const detailMainImage = document.getElementById('detailMainImage');
    const detailThumbImage = document.getElementById('detailThumbImage');
    const detailQuantity = document.getElementById('detailQuantity');
    let selectedDetailProduct = null;
    let detailQty = 1;

    function openProductDetail(card) {
        const addButton = card.querySelector('.add-to-cart');
        const image = card.querySelector('img');
        const brand = card.querySelector('.product-brand')?.textContent.trim() || card.dataset.brand;
        const name = card.querySelector('h3')?.textContent.trim() || addButton.dataset.name;
        const description = card.querySelector('.product-info p')?.textContent.trim() || 'Una opción práctica para tu día a día.';
        selectedDetailProduct = {
            id: addButton.dataset.id,
            name: addButton.dataset.name,
            displayName: name,
            brand,
            price: Number(addButton.dataset.price),
            image: addButton.dataset.image,
            description
        };
        detailQty = 1;
        detailQuantity.textContent = detailQty;
        detailMainImage.src = selectedDetailProduct.image;
        detailThumbImage.src = selectedDetailProduct.image;
        detailMainImage.alt = selectedDetailProduct.displayName;
        detailThumbImage.alt = selectedDetailProduct.displayName;
        document.getElementById('detailBrand').textContent = brand;
        document.getElementById('detailName').textContent = name;
        document.getElementById('detailBreadcrumbName').textContent = name;
        document.getElementById('detailPrice').textContent = formatCOP(selectedDetailProduct.price);
        document.getElementById('detailDescription').textContent = description;
        document.getElementById('detailLongDescription').textContent = description + ' Ideal para acompañarte en tus actividades cotidianas.';
        document.getElementById('detailFavorite').classList.remove('is-favorite');
        document.getElementById('detailFavorite').textContent = '♡';

        // Oculta el contenido principal y muestra la ficha del producto.
        document.querySelector('main').classList.add('catalog-detail-active');
        detailView.classList.add('is-visible');
        detailView.setAttribute('aria-hidden', 'false');
        document.body.classList.add('detail-open');
        detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('.product-card').forEach(card => {
        const viewButton = card.querySelector('.view-product');
        viewButton?.addEventListener('click', () => openProductDetail(card));
        const image = card.querySelector('img');
        image?.addEventListener('click', () => openProductDetail(card));
        image.style.cursor = 'pointer';
        card.querySelector('h3')?.addEventListener('click', () => openProductDetail(card));
        card.querySelector('h3').style.cursor = 'pointer';
    });

    function closeProductDetail() {
        detailView.classList.remove('is-visible');
        detailView.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('detail-open');
        document.querySelector('main').classList.remove('catalog-detail-active');
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    detailBack.addEventListener('click', closeProductDetail);
    document.getElementById('detailMinus').addEventListener('click', () => {
        detailQty = Math.max(1, detailQty - 1);
        detailQuantity.textContent = detailQty;
    });
    document.getElementById('detailPlus').addEventListener('click', () => {
        detailQty += 1;
        detailQuantity.textContent = detailQty;
    });
    document.getElementById('detailFavorite').addEventListener('click', event => {
        const button = event.currentTarget;
        button.classList.toggle('is-favorite');
        const active = button.classList.contains('is-favorite');
        button.textContent = active ? '♥' : '♡';
    });
    document.getElementById('detailAddToCart').addEventListener('click', () => {
        if (!selectedDetailProduct) return;
        const existing = cart.get(selectedDetailProduct.id);
        if (existing) {
            existing.quantity += detailQty;
        } else {
            cart.set(selectedDetailProduct.id, {
                id: selectedDetailProduct.id,
                name: selectedDetailProduct.name,
                price: selectedDetailProduct.price,
                image: selectedDetailProduct.image,
                quantity: detailQty
            });
        }
        renderCart();
        openCart();
    });