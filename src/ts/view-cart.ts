import { CartItem } from "./CarItem";
import { Product } from "./Product";
import { removeFromCart } from "./service-cart";

export function createCart() {

    function openModal() {
        const modal = document.getElementById("modal-cart");
        modal.style.display = "flex";
        document.body.classList.add("modal-open");
        showCart();
    }

    function closeModal() {
        const modal = document.getElementById("modal-cart");
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    document.getElementById("shopping-cart").addEventListener("click", openModal);
    document.getElementById("close-modal").addEventListener("click", closeModal);

    //Fechar o modal quando o usuário clica fora da área do modal
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("modal-cart");
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    });
}

export function showCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        const emptyCart = document.createElement("p");
        emptyCart.textContent = "Carrinho vazio";
        cartContainer.appendChild(emptyCart);
        return;
    }

    cart.forEach((productCart: CartItem) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-cart");
        productDiv.dataset.productId = productCart.id;

        productDiv.innerHTML = `
        <img src="${productCart.image}" alt="${productCart.name}">
        <div class="info-products">
          <h2>${productCart.name.toUpperCase()}</h2>
          <p class="price">R$ ${productCart.price.toFixed(2)}</p>
          <p>até ${productCart.parcelamento.join("x de R$")}</p>
          <p>Quantidade: ${productCart.quantity}</p>
          <p class="total">Subtotal: R$ ${(productCart.price*productCart.quantity).toFixed(2)}</p>
        </div>
      `;

        const buttonRemove = document.createElement("button");
        buttonRemove.textContent = "Remover";
        buttonRemove.addEventListener("click", () => {
            removeFromCart(productCart);
            showCart();
        });
        productDiv.appendChild(buttonRemove);
        cartContainer.appendChild(productDiv);
    });

    //Simula Compra
    const buttonBuy = document.createElement("button");
    buttonBuy.textContent = "Finalizar compra";
    buttonBuy.addEventListener("click", () => {
        alert("Compra finalizada com sucesso!");
        localStorage.removeItem("cart");
        showCart();
    });

    const total = cart.reduce((acc: number, item: CartItem) => acc + item.price*item.quantity, 0);
    const buttonBuyDiv = document.createElement("div");
    buttonBuyDiv.classList.add("finalize-buy");
    buttonBuyDiv.innerHTML = `<p class="price-total">Valor Total: R$ ${total.toFixed(2)}</p>`;

    buttonBuyDiv.appendChild(buttonBuy);
    cartContainer.appendChild(buttonBuyDiv);

}