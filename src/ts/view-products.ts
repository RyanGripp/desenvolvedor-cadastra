import { Product } from "./Product";
import { addToCart } from "./service-cart";
import { orderProducts } from "./service-order";
import { filterProducts } from "./service-filter";
import { cartQuantity } from "./view-cart";

export function displayProducts(products: Product[], loadMore = false): void {
    //Filtrando Produtos
    products = filterProducts(products);

    //Ordenando Produtos
    const selectedOption = document.querySelector(".selected-option").getAttribute("data-value");
    products = orderProducts(products, selectedOption);

    const productsContainer = document.getElementById("products-container");
    const loadMoreButton = document.getElementById("load-more");
    let loadAll = 0;
    if (window.innerWidth > 768) {
        loadAll = loadMore ? products.length : 9;
    } else {
        loadAll = loadMore ? products.length : 4; //Mobile
    }
    productsContainer.innerHTML = "";

    for (let i = 0; i < loadAll && i < products.length; i++) {
        const product = products[i];
        const productDiv = createProductDiv(product);
        productsContainer.appendChild(productDiv);
    }

    if (loadAll >= products.length) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "block";
    }

    loadMoreButton.addEventListener("click", () => {
        displayProducts(products, true);
    });

    function createProductDiv(product: Product) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.dataset.productId = product.id;

        productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name.toUpperCase()}</h2>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <p>até ${product.parcelamento.join("x de R$")}</p>
      `;

        const buttonBuy = document.createElement("button");
        buttonBuy.textContent = "Comprar";
        buttonBuy.addEventListener("click", () => {
            addToCart(product);
            cartQuantity();
        });
        productDiv.appendChild(buttonBuy);
        return productDiv;
    }
}